const logger = {
    log:   (...args) => { if (import.meta.env.DEV) console.log(...args) },
    error: (...args) => { if (import.meta.env.DEV) console.error(...args) },
    warn:  (...args) => { if (import.meta.env.DEV) console.warn(...args) },
}

export default logger
