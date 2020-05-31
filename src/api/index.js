const uri = 'http://localhost:3001/events';

const fetchEvent = async page => {
    const response = await fetch(`${uri}`);
    const data = await response.json();

    if (response.status >= 400) {
        throw new Error(data.errors);
    }

    return data;
}

export { fetchEvent };