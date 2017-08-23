type LogCallback = (error?: any, level?: string, msg?: string, meta?: any) => void;

interface LeveledLogMethod {
    (msg: string, callback: LogCallback): Logger;
    (msg: string, meta: any, callback: LogCallback): Logger;
    (msg: string, ...meta: any[]): Logger;
}

interface LogMethod {
    (level: string, msg: string, callback: LogCallback): Logger;
    (level: string, msg: string, meta: any, callback: LogCallback): Logger;
    (level: string, msg: string, ...meta: any[]): Logger;
}

export interface Logger {
    log: LogMethod;

    error: LeveledLogMethod;
    warn: LeveledLogMethod;
    help: LeveledLogMethod;
    data: LeveledLogMethod;
    info: LeveledLogMethod;
    debug: LeveledLogMethod;
    prompt: LeveledLogMethod;
    verbose: LeveledLogMethod;
    input: LeveledLogMethod;
    silly: LeveledLogMethod;

    // for syslog levels only
    emerg: LeveledLogMethod;
    alert: LeveledLogMethod;
    crit: LeveledLogMethod;
    warning: LeveledLogMethod;
    notice: LeveledLogMethod;


    level: string;
}