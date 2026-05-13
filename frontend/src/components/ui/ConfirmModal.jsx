export default function ConfirmModal({ message, onConfirm, onClose, confirmLabel = "Confirmar" }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={onClose}
        >
            <div
                className="rounded-2xl p-8 w-full max-w-sm flex flex-col gap-6"
                style={{
                    background: "rgba(15,15,20,0.98)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    boxShadow: "0 0 60px rgba(239,68,68,0.1)"
                }}
                onClick={e => e.stopPropagation()}
            >
                <p className="text-white text-sm">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold uppercase tracking-widest"
                        style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold uppercase tracking-widest"
                        style={{ background: "rgba(239,68,68,0.8)", color: "white" }}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}