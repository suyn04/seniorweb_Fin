$(document).ready(function() { //기상청 api로 주간 날씨 받는게 어려워 다른 api 사용
  const apiKey = '52ee0ba562b8a06c3d81bd580aafbe9b';
  const city = 'Seoul';

  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  $.ajax({
    url: apiUrl,
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      const fcstList = data.list;
      const tempInfo = $('#temperature-info');

      const tempTable = $('<table>');
      const tempRow = $('<tr>');

      for (let i = 1; i < fcstList.length; i += 8) {
        const fcst = fcstList[i];
        const date = new Date(fcst.dt * 1000);
        const temp = fcst.main.temp;

        const dateString = date.toLocaleDateString('ko-KR', { weekday: 'short', day: 'numeric' });

        const tempItem = $('<td>')
        .append(`${dateString}`)
        .append($('<span>').text(`${temp}°C`));

        tempRow.append(tempItem);
      }
      tempInfo.append(tempTable);
      tempTable.append(tempRow);
    },
    error: function(error) {
      console.log('날씨 데이터 오류', error);
    }
  });
});
