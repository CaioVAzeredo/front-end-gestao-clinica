import { useEffect, useMemo, useState, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import styled from "styled-components";
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import ModalEditarAgendamento from "../../components/ModalEditarAgendamento"
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

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

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
function parseDatetimeLocalValue(val) { return val ? new Date(val) : null; }
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
  const [selected, setSelected] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showModalAtendimento, setShowModalAtendimento] = useState(false);
  const [atualizarDados, setAtualizarDados] = useState(false);
  
  const isMobile = useIsMobile();
  const calendarRef = useRef(null);

  // Carrega dados
  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [agendasRes, servicosRes, funcionariosRes] = await Promise.all([
          fetch(`http://localhost:${REACT_APP_PORT}/api/agendamentos`).then(r => r.json()).catch(() => ({})),
          fetch(`http://localhost:${REACT_APP_PORT}/api/servicos`).then(r => r.json()).catch(() => ({})),
          fetch(`http://localhost:${REACT_APP_PORT}/api/funcionarios`).then(r => r.json()).catch(() => ({})),
        ]);

        setAgendamentos(coalesceList(agendasRes));
        setServicos(coalesceList(servicosRes));
        setFuncionarios(coalesceList(funcionariosRes));
      } catch (e) {
        console.error(e);
        setAgendamentos([]);
      }
    };
    fetchDados();
  }, [atualizarDados]); // Adicionado `atualizarDados` como dependência

  useEffect(() => {
    if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.changeView(isMobile ? 'timeGridDay' : 'timeGridWeek');
    }
  }, [isMobile]);

  // Cores por status
  const statusColors = {
    HorarioMarcado: { backgroundColor: 'hsl(var(--primary) / 0.8)', borderColor: 'hsl(var(--primary))' },
    Pendente: { backgroundColor: 'hsl(var(--secondary) / 0.8)', borderColor: 'hsl(var(--secondary))' },
    Cancelado: { backgroundColor: 'rgba(220, 38, 38, 0.2)', borderColor: 'rgb(220, 38, 38)' },
    Concluido: { backgroundColor: 'rgba(34, 197, 94, 0.2)', borderColor: 'rgb(34, 197, 94)' }
  };

  // Backend -> FullCalendar
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

      const servicoId = ag?.servicoId ?? ag?.servico?.idServico ?? null;
      const funcionarioId = ag?.funcionarioId ?? ag?.funcionario?.idFuncionario ?? null;
      const clienteId = ag?.clienteId ?? ag?.cliente?.idCliente ?? null;

      return {
        id: String(idAgendamento),
        title: `${clienteNome} - ${servicoNome}`,
        start,
        end,
        ...color,
        extendedProps: {
          original: ag,
          status,
          notes: ag?.observacoes || '',
          clienteId,
          servicoId,
          funcionarioId,
          duracaoAtendimento: ag?.duracaoAtendimento ?? 0,
          patient: clienteNome,
          phone: ag?.cliente?.telefone || '',
          service: servicoNome,
          doctor: funcionarioNome,
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

      start: ev.start,
      end: ev.end,

      dataHoraInicio: toDatetimeLocalValue(ev.start?.toISOString()),
      duracaoAtendimento: xp?.duracaoAtendimento ?? 0,
      observacoes: xp?.notes ?? '',
      statusAgenda: xp?.status ?? 'HorarioMarcado',

      servicoId: xp?.servicoId ?? xp?.original?.servicoId ?? xp?.original?.servico?.idServico ?? '',
      funcionarioId: xp?.funcionarioId ?? xp?.original?.funcionarioId ?? xp?.original?.funcionario?.idFuncionario ?? '',
      clienteId: xp?.clienteId ?? xp?.original?.clienteId ?? xp?.original?.cliente?.idCliente ?? '',

      clienteNome: xp?.patient ?? xp?.original?.cliente?.nome ?? '',
      telefone: xp?.phone ?? xp?.original?.cliente?.telefone ?? '',
      servicoNome: xp?.service ?? xp?.original?.servico?.nomeServico ?? '',
      funcionarioNome: xp?.doctor ?? xp?.original?.funcionario?.nome ?? '',
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Adicione um delay para a transição de saída
    setTimeout(() => {
        setSelected(null);
    }, 400); // O tempo precisa ser o mesmo da transição do styled component
  };

  const handleSubmitModal = async (form) => {
    const idAgendamento = Number(form.idAgendamento ?? form.id);
    if (!idAgendamento) {
      alert('ID do agendamento inválido.');
      return;
    }

    const startDate = parseDatetimeLocalValue(form.dataHoraInicio);
    const dur = Number(form.duracaoAtendimento) || 0;

    const payload = {
      idAgendamento,
      dataHoraInicio: startDate?.toISOString(),
      duracaoAtendimento: dur,
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

    setAgendamentos(prev => {
      const idx = prev.findIndex(a =>
        String(a?.idAgendamento ?? a?.id ?? a?.agendamentoId) === String(idAgendamento)
      );
      if (idx === -1) return prev;

      const prevItem = prev[idx];
      const updated = {
        ...prevItem,
        dataHoraInicio: payload.dataHoraInicio,
        duracaoAtendimento: payload.duracaoAtendimento,
        observacoes: payload.observacoes,
        statusAgenda: payload.statusAgenda,
        clienteId: payload.clienteId,
        servicoId: payload.servicoId,
        funcionarioId: payload.funcionarioId,
        cliente: {
          ...(prevItem.cliente || {}),
          idCliente: payload.clienteId,
          nome: selected?.clienteNome ?? prevItem?.cliente?.nome
        },
        servico: {
          ...(prevItem.servico || {}),
          idServico: payload.servicoId,
          nomeServico: servicos.find(s => (s.idServico ?? s.id) === payload.servicoId)?.nomeServico ?? prevItem?.servico?.nomeServico
        },
        funcionario: {
          ...(prevItem.funcionario || {}),
          idFuncionario: payload.funcionarioId,
          nome: funcionarios.find(f => (f.idFuncionario ?? f.id) === payload.funcionarioId)?.nome ?? prevItem?.funcionario?.nome
        }
      };

      const novo = [...prev];
      novo[idx] = updated;
      return novo;
    });

    // Feche o modal imediatamente após o salvamento
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
          <button className='btn btn-novo' onClick={() => setShowModalAtendimento(true)}>Agendar Atendimento</button>
        </div>
      </div>
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="calendar-wrapper">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={isMobile ? {
                  left: 'prev,next today',
                  center: 'title',
                  right: ''
              } : {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView={isMobile ? 'timeGridDay' : 'timeGridWeek'}
              editable={false}
              selectable={false}
              selectMirror={true}
              dayMaxEvents={true}
              we_kends={true}
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
      
      {/* O componente ModalEditarAgendamento será renderizado apenas se `selected` não for null */}
      {selected && <ModalEditarAgendamento
        open={isDialogOpen}
        initialData={selected}
        servicos={servicos}
        funcionarios={funcionarios}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitModal}
      />}
      {showModalAtendimento && <ModalNovoAtendimento onClose={() => setShowModalAtendimento(false)} onAgendamentoCriado={() => setAtualizarDados(true)} />}
    </div>
    </Container>
  )
}