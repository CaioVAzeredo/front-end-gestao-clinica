import { useEffect, useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Plus } from "lucide-react"
import { Button } from "../../components/ui/button"

const REACT_APP_PORT = process.env.REACT_APP_PORT;

// Helpers
function addMinutes(date, minutes) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + (Number(minutes) || 0));
  return d;
}

function toDatetimeLocalValue(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function parseDatetimeLocalValue(val) {
  // val vem no formato "YYYY-MM-DDTHH:mm"
  // new Date(val) interpreta como local -> OK
  return val ? new Date(val) : null;
}

function coalesceList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.$values)) return payload.data.$values;
  return [];
}

export default function Agenda() {
  const [agendamentos, setAgendamentos] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [selected, setSelected] = useState(null); // estado de edição
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Carrega dados
  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [agendasRes, servicosRes, funcionariosRes] = await Promise.all([
          fetch(`http://localhost:${REACT_APP_PORT}/api/agendamentos`).then(r => r.json()).catch(() => ({})),
          fetch(`http://localhost:${REACT_APP_PORT}/api/servicos`).then(r => r.json()).catch(() => ({})),
          fetch(`http://localhost:${REACT_APP_PORT}/api/funcionarios`).then(r => r.json()).catch(() => ({})),
        ]);

        const listaAg = coalesceList(agendasRes);
        const listaSv = coalesceList(servicosRes);
        const listaFn = coalesceList(funcionariosRes);

        setAgendamentos(listaAg);
        setServicos(listaSv);
        setFuncionarios(listaFn);
      } catch (e) {
        console.error(e);
        setAgendamentos([]);
      }
    };

    fetchDados();
  }, []);

  // Mapeia status -> cores
  const statusColors = {
    HorarioMarcado: {
      backgroundColor: 'hsl(var(--primary) / 0.8)',
      borderColor: 'hsl(var(--primary))'
    },
    Pendente: {
      backgroundColor: 'hsl(var(--secondary) / 0.8)',
      borderColor: 'hsl(var(--secondary))'
    },
    Cancelado: {
      backgroundColor: 'rgba(220, 38, 38, 0.2)',
      borderColor: 'rgb(220, 38, 38)'
    },
    Concluido: {
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      borderColor: 'rgb(34, 197, 94)'
    }
  };

  // Transforma agendamentos do backend -> eventos do FullCalendar
  const events = useMemo(() => {
    if (!agendamentos) return [];
    return agendamentos.map((ag) => {
      const id = ag?.idAgendamento ?? ag?.id ?? ag?.agendamentoId;
      const start = new Date(ag.dataHoraInicio);
      const end = addMinutes(start, ag?.duracaoAtendimento ?? 0);

      const clienteNome = ag?.cliente?.nome?.trim() || 'Cliente';
      const servicoNome = ag?.servico?.nomeServico || 'Serviço';
      const funcionarioNome = ag?.funcionario?.nome || 'Funcionário';

      const status = ag?.statusAgenda || 'HorarioMarcado';
      const color = statusColors[status] || statusColors['HorarioMarcado'];

      return {
        id: String(id),
        title: `${clienteNome} - ${servicoNome}`,
        start,
        end,
        ...color,
        extendedProps: {
          original: ag, // guardamos o objeto original para edição
          patient: clienteNome,
          phone: ag?.cliente?.telefone || '',
          service: servicoNome,
          doctor: funcionarioNome,
          status: status,
          notes: ag?.observacoes || '',
          clienteId: ag?.clienteId,
          servicoId: ag?.servicoId,
          funcionarioId: ag?.funcionarioId,
          duracaoAtendimento: ag?.duracaoAtendimento ?? 0,
        }
      };
    });
  }, [agendamentos]);

  if (!agendamentos) return <p>Carregando...</p>;

  const handleEventClick = (clickInfo) => {
    const ev = clickInfo.event;
    const xp = ev.extendedProps;

    // Prepara um "draft" editável a partir do evento
    setSelected({
      id: ev.id,
      start: ev.start,
      end: ev.end,
      // campos editáveis
      dataHoraInicio: toDatetimeLocalValue(ev.start?.toISOString()),
      duracaoAtendimento: xp?.duracaoAtendimento ?? 0,
      observacoes: xp?.notes ?? '',
      statusAgenda: xp?.status ?? 'HorarioMarcado',
      servicoId: xp?.servicoId ?? xp?.original?.servicoId ?? null,
      funcionarioId: xp?.funcionarioId ?? xp?.original?.funcionarioId ?? null,
      clienteId: xp?.clienteId ?? xp?.original?.clienteId ?? null,
      // apenas para exibir no modal
      clienteNome: xp?.patient ?? '',
      telefone: xp?.phone ?? '',
      servicoNome: xp?.service ?? '',
      funcionarioNome: xp?.doctor ?? '',
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelected(null);
  };

  const handleChangeField = (field, value) => {
    setSelected(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);

    try {
      const startDate = parseDatetimeLocalValue(selected.dataHoraInicio);
      const dur = Number(selected.duracaoAtendimento) || 0;

      const payload = {
        idAgendamento: Number(selected.id),
        dataHoraInicio: startDate?.toISOString(),
        duracaoAtendimento: dur,
        observacoes: selected.observacoes ?? '',
        clienteId: Number(selected.clienteId),
        servicoId: Number(selected.servicoId),
        funcionarioId: Number(selected.funcionarioId),
        statusAgenda: selected.statusAgenda || 'HorarioMarcado'
      };

      const resp = await fetch(
        `http://localhost:${REACT_APP_PORT}/api/agendamentos/${selected.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (!resp.ok) {
        const t = await resp.text().catch(() => '');
        throw new Error(`Erro ao salvar (${resp.status}). ${t}`);
      }

      // Atualiza localmente a lista
      setAgendamentos(prev => {
        const idx = prev.findIndex(a => String(a?.idAgendamento ?? a?.id ?? a?.agendamentoId) === String(selected.id));
        if (idx === -1) return prev;

        const prevItem = prev[idx];

        const updated = {
          ...prevItem,
          dataHoraInicio: payload.dataHoraInicio,
          duracaoAtendimento: payload.duracaoAtendimento,
          observacoes: payload.observacoes,
          clienteId: payload.clienteId,
          servicoId: payload.servicoId,
          funcionarioId: payload.funcionarioId,
          statusAgenda: payload.statusAgenda,
          // mantém objetos aninhados se já existirem; opcionalmente você pode recarregar por GET
          servico: payload.servicoId !== prevItem?.servico?.idServico ? prevItem?.servico : prevItem?.servico,
          funcionario: payload.funcionarioId !== prevItem?.funcionario?.idFuncionario ? prevItem?.funcionario : prevItem?.funcionario,
        };

        const novo = [...prev];
        novo[idx] = updated;
        return novo;
      });

      handleCloseDialog();
    } catch (e) {
      console.error(e);
      alert('Falha ao salvar as alterações do agendamento.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Agenda de atendimentos
          </h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => alert('Abrir fluxo de novo agendamento (implemente o modal/criação aqui)')}>
            <Plus className="h-4 w-4 mr-2" />
            Agendar
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {/* opcional */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="calendar-wrapper">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView='timeGridWeek'
              editable={false}
              selectable={false}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={events}
              eventClick={handleEventClick}
              height="600px"
              locale="pt-br"
              allDaySlot={false}
              slotMinTime="07:00:00"
              slotMaxTime="20:00:00"
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5, 6],
                startTime: '08:00',
                endTime: '18:00',
              }}
              nowIndicator={true}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
              }}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
              }}
              buttonText={{
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia'
              }}
              allDayText="Todo o dia"
              noEventsText="Nenhum atendimento agendado"
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição (custom, sem dependências extras) */}
      {isDialogOpen && selected && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={(e) => {
            // fecha somente se clicar no backdrop
            if (e.target === e.currentTarget) handleCloseDialog();
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              width: '100%',
              maxWidth: 520,
              padding: 20,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            <h2 className="text-xl font-semibold mb-4">Editar agendamento #{selected.id}</h2>

            <div className="space-y-3">
              {/* Data/Hora de Início */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Data e hora de início</label>
                <input
                  type="datetime-local"
                  value={selected.dataHoraInicio || ''}
                  onChange={(e) => handleChangeField('dataHoraInicio', e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>

              {/* Duração */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Duração (minutos)</label>
                <input
                  type="number"
                  min={0}
                  value={selected.duracaoAtendimento ?? 0}
                  onChange={(e) => handleChangeField('duracaoAtendimento', e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>

              {/* Serviço */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Serviço</label>
                <select
                  className="border rounded px-3 py-2"
                  value={selected.servicoId ?? ''}
                  onChange={(e) => handleChangeField('servicoId', e.target.value)}
                >
                  <option value="" disabled>Selecione...</option>
                  {servicos.map(sv => (
                    <option key={sv.idServico ?? sv.id} value={sv.idServico ?? sv.id}>
                      {sv.nomeServico ?? sv.nome ?? 'Serviço'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Funcionário */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Funcionário</label>
                <select
                  className="border rounded px-3 py-2"
                  value={selected.funcionarioId ?? ''}
                  onChange={(e) => handleChangeField('funcionarioId', e.target.value)}
                >
                  <option value="" disabled>Selecione...</option>
                  {funcionarios.map(fn => (
                    <option key={fn.idFuncionario ?? fn.id} value={fn.idFuncionario ?? fn.id}>
                      {fn.nome ?? fn.name ?? 'Funcionário'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Status</label>
                <select
                  className="border rounded px-3 py-2"
                  value={selected.statusAgenda}
                  onChange={(e) => handleChangeField('statusAgenda', e.target.value)}
                >
                  <option value="HorarioMarcado">Horário Marcado</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Cancelado">Cancelado</option>
                  <option value="Concluido">Concluído</option>
                </select>
              </div>

              {/* Observações */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Observações</label>
                <textarea
                  rows={4}
                  className="border rounded px-3 py-2"
                  value={selected.observacoes || ''}
                  onChange={(e) => handleChangeField('observacoes', e.target.value)}
                />
              </div>

              {/* Informações somente leitura do cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1">Cliente</label>
                  <input className="border rounded px-3 py-2 bg-gray-50" value={selected.clienteNome || ''} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1">Telefone</label>
                  <input className="border rounded px-3 py-2 bg-gray-50" value={selected.telefone || ''} readOnly />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={handleCloseDialog} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
