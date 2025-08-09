import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Plus } from "lucide-react"
import { Button } from "../../components/ui/button"

const REACT_APP_PORT = process.env.REACT_APP_PORT;

export default function Agenda() {
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await fetch(`http://localhost:${REACT_APP_PORT}/api/agendamentos`);
        
        if (!response.ok) {
          throw new Error('Erro ao buscar os agendamentos.');
        }

        const data = await response.json();
        
        // Mapeia os dados da API para o formato de eventos do FullCalendar
        const mappedEvents = data.data.$values.map(agendamento => ({
          id: agendamento.idAgendamento, // Usando o ID do agendamento
          title: agendamento.cliente.nome + ' - ' + agendamento.servico.nomeServico, // Criando o título do evento
          start: agendamento.dataHoraInicio, // Data e hora de início
          end: agendamento.dataHoraFim, // Data e hora de fim
          backgroundColor: 'hsl(var(--primary) / 0.8)', // Exemplo de cor
          borderColor: 'hsl(var(--primary))',
          extendedProps: {
            patient: agendamento.cliente.nome,
            service: agendamento.servico.nomeServico,
            notes: agendamento.observacoes,
            // Adicione outras propriedades que você possa precisar da API
          }
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Falha ao carregar agendamentos:", error);
        // Opcional: mostrar um erro na UI para o usuário
      } finally {
        setIsLoading(false);
      }
    };

    fetchDados();
  }, []); // O array de dependências vazio garante que o useEffect rode apenas uma vez, na montagem do componente.
 
  if (isLoading) {
    return <p>Carregando...</p>;
  }

  const handleEventClick = (clickInfo) => {
    setSelectedAppointment({
      ...clickInfo.event.extendedProps,
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end
    })
    setIsDialogOpen(true)
  }

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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Agendar
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
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
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={events} // Agora usando o estado "events" populado pela API
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
              noEventsText="Nenhuma atendimento agendada"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}