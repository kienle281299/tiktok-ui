import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
    const [debouncedValue, setDebounedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounedValue(value), delay);
        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    return debouncedValue;
}

export default useDebounce;
