export async function getPulse(unix_time: number) {
  if (unix_time >= new Date().getTime()){
    throw new Error('Pulse is set in the future');
  }
  try {
    const response = await fetch('https://random.uchile.cl/beacon/2.1-beta/pulse?timeGE='+String(unix_time));
    const data = await response.json();
    console.log(data)
    const pulse: string = data['pulse']['outputValue'];
    const timestamp = data['pulse']['timeStamp'];
    const date = new Date(unix_time).toISOString();

    const prefix1 = timestamp.substring(0, 17);
    const prefix2 = date.substring(0, 17);

    if(prefix1 === prefix2){
        if (typeof pulse === 'string' && pulse != ''){
            return {
              pulso: pulse,
              fecha: timestamp,
            }
        } else {
            console.log('pulse not found');
        }
    } else {
        if (typeof pulse === 'string' && pulse != ''){
            return {
              pulso: pulse,
              fecha: timestamp,
            }
        } else {
            console.log('pulse time does not match asked time');
        }
    }

  } catch (err) {
    console.log(err);
  }
};
