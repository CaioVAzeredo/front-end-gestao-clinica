import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Plus, CalendarDays } from "lucide-react"
import { Button } from "../../components/ui/button"

export default function Agenda() {
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Dados simulados das consultas
  const events = [
    {
      id: '1',
      title: 'Maria Silva - Consulta Geral',
      start: '2025-08-06T08:00:00',
      end: '2025-08-06T08:30:00',
      backgroundColor: 'hsl(var(--primary) / 0.8)',
      borderColor: 'hsl(var(--primary))',
      extendedProps: {
        patient: "Maria Silva",
        phone: "(11) 98765-4321",
        service: "Consulta Geral",
        doctor: "Dr. João Santos",
        status: "confirmada",
        notes: "Paciente com histórico de hipertensão",
        address: "Rua das Flores, 123"
      }
    },
    {
      id: '2',
      title: 'Carlos Oliveira - Cardiologia',
      start: '2025-08-06T09:00:00',
      end: '2025-08-06T09:45:00',
      backgroundColor: 'hsl(var(--secondary) / 0.8)',
      borderColor: 'hsl(var(--secondary))',
      extendedProps: {
        patient: "Carlos Oliveira",
        phone: "(11) 91234-5678",
        service: "Cardiologia",
        doctor: "Dra. Ana Costa",
        status: "pendente",
        notes: "Primeira consulta - exames de rotina",
        address: "Av. Principal, 456"
      }
    },
    {
      id: '3',
      title: 'Lucia Ferreira - Dermatologia',
      start: '2025-08-06T10:30:00',
      end: '2025-08-06T11:00:00',
      backgroundColor: 'hsl(var(--accent) / 0.8)',
      borderColor: 'hsl(var(--accent))',
      extendedProps: {
        patient: "Lucia Ferreira",
        phone: "(11) 95555-1234",
        service: "Dermatologia",
        doctor: "Dr. Pedro Lima",
        status: "confirmada",
        notes: "Retorno - acompanhamento tratamento",
        address: "Rua da Saúde, 789"
      }
    },
    {
      id: '4',
      title: 'Roberto Santos - Ortopedia',
      start: '2025-08-06T14:00:00',
      end: '2025-08-06T15:00:00',
      backgroundColor: 'hsl(var(--success) / 0.8)',
      borderColor: 'hsl(var(--success))',
      extendedProps: {
        patient: "Roberto Santos",
        phone: "(11) 97777-8888",
        service: "Ortopedia",
        doctor: "Dra. Mariana Souza",
        status: "confirmada",
        notes: "Consulta pós-cirúrgica",
        address: "Av. Central, 321"
      }
    },
    {
      id: '5',
      title: 'Elena Costa - Pediatria',
      start: '2025-08-06T15:30:00',
      end: '2025-08-06T16:00:00',
      backgroundColor: 'hsl(var(--warning) / 0.8)',
      borderColor: 'hsl(var(--warning))',
      extendedProps: {
        patient: "Elena Costa",
        phone: "(11) 96666-9999",
        service: "Pediatria",
        doctor: "Dr. Fernando Silva",
        status: "cancelada",
        notes: "Paciente solicitou reagendamento",
        address: "Rua das Crianças, 654"
      }
    }
  ]

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
            Nova Consulta
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
              noEventsText="Nenhuma consulta agendada"
            />
          </div>
        </CardContent>
      </Card>


    </div>
  )
}