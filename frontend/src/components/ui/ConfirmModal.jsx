export default function ConfirmModal({ message, onConfirm, onClose, confirmLabel = "Confirmar" }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="rounded-2xl p-6 w-full max-w-sm flex flex-col gap-5"
                style={{
                    background: "rgba(12,13,18,0.98)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    boxShadow: "0 0 40px rgba(239,68,68,0.08), 0 24px 48px rgba(0,0,0,0.6)"
                }}
                onClick={e => e.stopPropagation()}
            >
                <p className="text-sm leading-relaxed" style={{ color: "#d1d5db" }}>{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors duration-150"
                        style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-150"
                        style={{ background: "rgba(239,68,68,0.75)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.9)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.75)"}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
