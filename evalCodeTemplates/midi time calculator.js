const tick = 10000; // enter tick here
const ppq = 192; // pulses per quarter note
const bpm = 190; // beats per minute

interaction.followUp(`Calculated output: ${tick / (ppq * bpm / 60)} seconds`);