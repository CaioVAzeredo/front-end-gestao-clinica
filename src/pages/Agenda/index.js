import { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import styled from "styled-components";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

// Importando os modais já revisados
import ModalEditarAgendamento from "../../components/ModalEditarAgendamento";
import ModalNovoAtendimento from "../../components/ModalNovoAtendimento";

const REACT_APP_PORT = process.env.REACT_APP_PORT;

const Container = styled.div`
  .btn {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .btn-novo {
    background: #00a884;
    color: white;
  }
`;

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

function coalesceList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.$values)) return payload.$values;
  if (Array.isArray(payload?.data?.$values)) return payload.data.$values;
  return [];
}

export default function Agenda() {
  const [agendamentos, setAgendamentos] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [selected, setSelected] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showModalNovoAtendimento, setShowModalNovoAtendimento] = useState(false);
  
  // Estado para forçar a atualização dos dados após uma ação (cadastro ou edição)
  const [shouldFetchData, setShouldFetchData] = useState(true);

  // Carrega dados da API
  useEffect(() => {
    if (!shouldFetchData) return;

    const fetchDados = async () => {
      try {
        const [agendasRes, servicosRes, funcionariosRes, clientesRes] = await Promise.all([
          fetch(`http://localhost:${REACT_APP_PORT}/api/agendamentos`).then(r => r.json()).catch(() => ({})),
          fetch(`http://localhost:${REACT_APP_PORT}/api/servicos`).then(r => r.json()).catch(() => ({})),
          fetch(`http://localhost:${REACT_APP_PORT}/api/funcionarios`).then(r => r.json()).catch(() => ({})),
          fetch(`http://localhost:${REACT_APP_PORT}/api/clientes`).then(r => r.json()).catch(() => ({})),
        ]);

        setAgendamentos(coalesceList(agendasRes));
        setServicos(coalesceList(servicosRes));
        setFuncionarios(coalesceList(funcionariosRes));
        setClientes(coalesceList(clientesRes));
      } catch (e) {
        console.error(e);
        setAgendamentos([]);
      } finally {
        setShouldFetchData(false);
      }
    };
    fetchDados();
  }, [shouldFetchData]); // O effect roda quando shouldFetchData for true

  // Cores por status
  const statusColors = {
    HorarioMarcado: { backgroundColor: 'hsl(var(--primary) / 0.8)', borderColor: 'hsl(var(--primary))' },
    Pendente: { backgroundColor: 'hsl(var(--secondary) / 0.8)', borderColor: 'hsl(var(--secondary))' },
    Cancelado: { backgroundColor: 'rgba(220, 38, 38, 0.2)', borderColor: 'rgb(220, 38, 38)' },
    Concluido: { backgroundColor: 'rgba(34, 197, 94, 0.2)', borderColor: 'rgb(34, 197, 94)' }
  };

  // Mapeia dados da API para o formato do FullCalendar
  const events = useMemo(() => {
    if (!agendamentos) return [];
    return agendamentos.map((ag) => {
      const idAgendamento = ag?.idAgendamento ?? ag?.id ?? ag?.agendamentoId;
      const start = new Date(ag.dataHoraInicio);
      const end = addMinutes(start, ag?.duracaoAtendimento ?? 0);

      const clienteNome = ag?.cliente?.nome?.trim() || 'Cliente';
      const servicoNome = ag?.servico?.nomeServico || 'Serviço';
      const funcionarioNome = ag?.funcionario?.nome || 'Funcionário';

      const status = ag?.statusAgenda || 'HorarioMarcado';
      const color = statusColors[status] || statusColors['HorarioMarcado'];

      // extrai ids “flat” com fallback para objetos aninhados
      const servicoId = ag?.servicoId ?? ag?.servico?.idServico ?? null;
      const funcionarioId = ag?.funcionarioId ?? ag?.funcionario?.idFuncionario ?? null;
      const clienteId = ag?.clienteId ?? ag?.cliente?.idCliente ?? null;

      return {
        id: String(idAgendamento), // FullCalendar ID
        title: `${clienteNome} - ${servicoNome}`,
        start,
        end,
        ...color,
        extendedProps: {
          original: ag,
          status,
          observacoes: ag?.observacoes || '',
          clienteId,
          servicoId,
          funcionarioId,
          duracaoAtendimento: ag?.duracaoAtendimento ?? 0,
          clienteNome,
          telefone: ag?.cliente?.telefone || '',
          servicoNome,
          funcionarioNome,
          idAgendamento, 
        }
      };
    });
  }, [agendamentos]);

  if (!agendamentos) return <p>Carregando...</p>;

  const handleEventClick = (clickInfo) => {
    const ev = clickInfo.event;
    const xp = ev.extendedProps;
    const idAgendamento = xp?.idAgendamento ?? Number(ev.id);

    setSelected({
      id: idAgendamento,
      idAgendamento,
      dataHoraInicio: toDatetimeLocalValue(ev.start?.toISOString()),
      duracaoAtendimento: xp?.duracaoAtendimento ?? 0,
      observacoes: xp?.observacoes ?? '',
      statusAgenda: xp?.status ?? 'HorarioMarcado',
      servicoId: xp?.servicoId ?? xp?.original?.servicoId ?? xp?.original?.servico?.idServico ?? '',
      funcionarioId: xp?.funcionarioId ?? xp?.original?.funcionarioId ?? xp?.original?.funcionario?.idFuncionario ?? '',
      clienteId: xp?.clienteId ?? xp?.original?.clienteId ?? xp?.original?.cliente?.idCliente ?? '',
      clienteNome: xp?.clienteNome ?? xp?.original?.cliente?.nome ?? '',
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelected(null);
  };
  
  const handleNovoAgendamento = () => {
    setShowModalNovoAtendimento(false);
    setShouldFetchData(true);
  };

  const handleSubmitModal = async (form) => {
    const idAgendamento = Number(form.idAgendamento ?? form.id);
    if (!idAgendamento) {
      alert('ID do agendamento inválido.');
      return;
    }

    // Removendo campos que não existem na API para evitar erros
    const payload = {
        idAgendamento,
        dataHoraInicio: form.dataHoraInicio, // Já está no formato ISO ou local
        duracaoAtendimento: Number(form.duracaoAtendimento),
        observacoes: form.observacoes ?? '',
        clienteId: Number(form.clienteId),
        servicoId: Number(form.servicoId),
        funcionarioId: Number(form.funcionarioId),
        statusAgenda: form.statusAgenda || 'HorarioMarcado'
    };

    const resp = await fetch(
      `http://localhost:${REACT_APP_PORT}/api/agendamentos/${idAgendamento}`,
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

    // Após salvar, atualiza os dados do calendário
    setShouldFetchData(true);
    handleCloseDialog();
  };

  return (
    <Container>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Agenda de atendimentos
            </h1>
          </div>
          <div className="actions">
            <button className='btn btn-novo' onClick={() => setShowModalNovoAtendimento(true)}>Agendar Atendimento</button>
          </div>
        </div>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground" />
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
                eventTimeFormat={{ hour: '2-digit', minute: '2-digit', meridiem: false }}
                slotLabelFormat={{ hour: '2-digit', minute: '2-digit', meridiem: false }}
                buttonText={{ today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia' }}
                allDayText="Todo o dia"
                noEventsText="Nenhum atendimento agendado"
              />
            </div>
          </CardContent>
        </Card>

        {/* Modal de Edição */}
        <ModalEditarAgendamento
          open={isDialogOpen}
          initialData={selected}
          servicos={servicos}
          funcionarios={funcionarios}
          onClose={handleCloseDialog}
          onSubmit={handleSubmitModal}
        />

        {/* Modal de Novo Agendamento */}
        {showModalNovoAtendimento && (
          <ModalNovoAtendimento
            clientes={clientes}
            servicos={servicos}
            funcionarios={funcionarios}
            onCreate={handleNovoAgendamento}
            onClose={() => setShowModalNovoAtendimento(false)}
          />
        )}
      </div>
    </Container>
  );
}