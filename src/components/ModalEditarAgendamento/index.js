import { useEffect, useState } from "react";
import { Button } from "../ui/button";

/**
 * ModalEditarAgendamento
 * Props:
 * - open: boolean
 * - initialData: {
 *     id, dataHoraInicio (YYYY-MM-DDTHH:mm), duracaoAtendimento, observacoes,
 *     statusAgenda, servicoId, funcionarioId, clienteNome, telefone
 *   }
 * - servicos: []
 * - funcionarios: []
 * - onCancel: () => void
 * - onSubmit: (formData) => void   // retorna o objeto do formulário editado
 */
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
        <div
            className="fixed inset-0 z-50"
            style={{
                background: "rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onCancel?.();
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 12,
                    width: "100%",
                    maxWidth: 520,
                    padding: 20,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                }}
            >
                <h2 className="text-xl font-semibold mb-4">
                    Editar agendamento #{form.id}
                </h2>

                <div className="space-y-3">
                    {/* Data/Hora de Início */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Data e hora de início</label>
                        <input
                            type="datetime-local"
                            value={form.dataHoraInicio || ""}
                            onChange={(e) => handleChange("dataHoraInicio", e.target.value)}
                            className="border rounded px-3 py-2"
                        />
                    </div>

                    {/* Duração */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Duração (minutos)</label>
                        <input
                            type="number"
                            min={0}
                            value={form.duracaoAtendimento ?? 0}
                            onChange={(e) => handleChange("duracaoAtendimento", e.target.value)}
                            className="border rounded px-3 py-2"
                        />
                    </div>

                    {/* Serviço */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Serviço</label>
                        <select
                            className="border rounded px-3 py-2"
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
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Funcionário</label>
                        <select
                            className="border rounded px-3 py-2"
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
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Status</label>
                        <select
                            className="border rounded px-3 py-2"
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
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Observações</label>
                        <textarea
                            rows={4}
                            className="border rounded px-3 py-2"
                            value={form.observacoes || ""}
                            onChange={(e) => handleChange("observacoes", e.target.value)}
                        />
                    </div>

                    {/* Somente leitura */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium mb-1">Cliente</label>
                            <input
                                className="border rounded px-3 py-2 bg-gray-50"
                                value={form.clienteNome || ""}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1">Telefone</label>
                            <input
                                className="border rounded px-3 py-2 bg-gray-50"
                                value={form.telefone || ""}
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                    <Button variant="outline" onClick={onCancel} disabled={saving}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={saving}>
                        {saving ? "Salvando..." : "Salvar alterações"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
