<script lang="ts">
  import dayjs, { Dayjs } from 'dayjs';

  export let start: Dayjs = dayjs();
  export let end: Dayjs;

  let startUnixTimeMillis: number = start.valueOf();
  let endUnixTimeMillis: number = end.valueOf();

  let diffTime = Math.abs(startUnixTimeMillis - endUnixTimeMillis);
  let days: number;
  let hours: number;
  let minutes: number;
  let seconds: number;

  $: {
    days = diffTime / (24 * 60 * 60 * 1000);
    hours = (days % 1) * 24;
    minutes = (hours % 1) * 60;
    seconds = (minutes % 1) * 60;

    [days, hours, minutes, seconds] = [
      Math.floor(days),
      Math.floor(hours),
      Math.floor(minutes),
      Math.floor(seconds)
    ];

    console.log(days, hours, minutes, seconds);
  }

  setInterval(() => {
    if (diffTime > 0) {
      diffTime -= 1000;
    }
  }, 1000);

  const counterClasses = 'text-3xl md:text-4xl';
</script>

<div class="grid grid-flow-col gap-5 text-center auto-cols-max justify-center font-light uppercase">
  <div class="flex flex-col items-center">
    <span class="countdown {counterClasses}">
      <span style="--value:{days};" />
    </span>
    days
  </div>
  <div class="flex flex-col items-center">
    <span class="countdown {counterClasses}">
      <span style="--value:{hours};" />
    </span>
    hours
  </div>
  <div class="flex flex-col items-center">
    <span class="countdown {counterClasses}">
      <span style="--value:{minutes};" />
    </span>
    min
  </div>
  <div class="flex flex-col items-center">
    <span class="countdown {counterClasses}">
      <span style="--value:{seconds};" />
    </span>
    sec
  </div>
</div>

<style>
</style>
