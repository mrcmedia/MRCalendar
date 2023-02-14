const getDateTime = (d) => {
    // const d =  new Date(Date.parse(startDate))
    const year = (d.getFullYear()).toString();
    const month = ((d.getMonth()) + 101).toString().slice(-2);
    const date = ((d.getDate()) + 100).toString().slice(-2);

    const hours = ((d.getHours()) + 100).toString().slice(-2);
    const mins = ((d.getMinutes()) + 100).toString().slice(-2);

    return `${year}-${month}-${date}T${hours}:${mins}`;
  }


  const getDate = (d) => {
    // const d =  new Date(Date.parse(startDate))
    const year = (d.getFullYear()).toString();
    const month = ((d.getMonth()) + 101).toString().slice(-2);
    const date = ((d.getDate()) + 100).toString().slice(-2);

    return `${year}-${month}-${date}`;
  }

export {getDate , getDateTime}