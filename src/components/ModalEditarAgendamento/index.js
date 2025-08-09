import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function ModalEditarAgendamento({
    open,
    initialData,
    servicos = [],
    funcionarios = [],
    onCancel,
    onSubmit
}) {
    const [form, setForm] = useState(initialData || {});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setForm(initialData || {});
    }, [initialData]);

    if (!open || !form) return null;

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await onSubmit?.(form);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) onCancel?.();
            }}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        Editar agendamento #{form.id}
                    </h2>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Cliente (readonly) */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Cliente</label>
                        <div className="relative">
                            <input
                                className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50 text-gray-600 cursor-not-allowed"
                                value={form.clienteNome || ""}
                                readOnly
                                disabled
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Data/Hora de Início */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Data e hora de início</label>
                        <input
                            type="datetime-local"
                            value={form.dataHoraInicio || ""}
                            onChange={(e) => handleChange("dataHoraInicio", e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Duração */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Duração (minutos)</label>
                        <input
                            type="number"
                            min={0}
                            value={form.duracaoAtendimento ?? 0}
                            onChange={(e) => handleChange("duracaoAtendimento", e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Serviço */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Serviço</label>
                        <select
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={form.servicoId ?? ""}
                            onChange={(e) => handleChange("servicoId", e.target.value)}
                        >
                            <option value="" disabled>Selecione...</option>
                            {servicos.map((sv) => (
                                <option key={sv.idServico ?? sv.id} value={sv.idServico ?? sv.id}>
                                    {sv.nomeServico ?? sv.nome ?? "Serviço"}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Funcionário */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Funcionário</label>
                        <select
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={form.funcionarioId ?? ""}
                            onChange={(e) => handleChange("funcionarioId", e.target.value)}
                        >
                            <option value="" disabled>Selecione...</option>
                            {funcionarios.map((fn) => (
                                <option key={fn.idFuncionario ?? fn.id} value={fn.idFuncionario ?? fn.id}>
                                    {fn.nome ?? fn.name ?? "Funcionário"}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={form.statusAgenda}
                            onChange={(e) => handleChange("statusAgenda", e.target.value)}
                        >
                            <option value="HorarioMarcado">Horário Marcado</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Cancelado">Cancelado</option>
                            <option value="Concluido">Concluído</option>
                        </select>
                    </div>

                    {/* Observações */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Observações</label>
                        <textarea
                            rows={4}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={form.observacoes || ""}
                            onChange={(e) => handleChange("observacoes", e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
                    <Button 
                        variant="outline" 
                        onClick={onCancel} 
                        disabled={saving}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={saving}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-[#008a70] transition-colors disabled:opacity-50"
                        >
                        {saving ? "Salvando..." : "Salvar alterações"}
                    </Button>
                </div>
            </div>
        </div>
    );
}