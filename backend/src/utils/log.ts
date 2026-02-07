const getCallerInfo = () => {
    const stack = new Error().stack?.split('\n')[3] || '';
    const match = stack.match(/at .+ \((.+):(\d+):\d+\)/) || stack.match(/at (.+):(\d+):\d+/);
    if (match) {
        const file = match[1].split('/').pop();
        return `[${file}:${match[2]}]`;
    }
    return '';
};

export const jlog = (data: unknown) =>
    console.log(getCallerInfo(), JSON.stringify(data, null, 2));

export const j = (data: unknown) => JSON.stringify(data, null, 2);

// Add to global scope
declare global {
    var jlog: (data: unknown) => void;
    var j: (data: unknown) => string;
}

globalThis.jlog = jlog;
globalThis.j = j;
