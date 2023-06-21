$(document).ready(function() {
  const apiUrl1 = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
  const apiUrl2 = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';
  const serviceKey = '4WgvMoPczvKuMAM6wUIWqc0DfqHlLTIzq6Fba/ZeLm0zRoSyAjVuYegOE9Xc3Xogszz/6GQPNDdD7ie2xAVSDA==';
  const numOfRows = 1000;
  const pageNo = 1;

  function getBaseDateTime(minutes){ //api 호출시간 맞추는 함수
    const now = new Date();
    const date = new Date(now - minutes * 60 * 1000);

    const baseDate = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
    const baseTime = pad(date.getHours()) + '30';

    return { baseDate: baseDate, baseTime: baseTime };
  };

  function pad(number){
    return number.toString().padStart(2, '0');
  }; //출력값 맞추는 함수


  function WeatherApi1(){ //초단기실황 API
    const { baseDate, baseTime } = getBaseDateTime(40);

    $.getJSON(apiUrl1, {
      ServiceKey: serviceKey,
      pageNo: pageNo,
      numOfRows: 10,
      dataType: 'JSON',
      base_date: baseDate,
      base_time: baseTime,
      nx: 59, // 오류로 좌표 고정
      ny: 122
    })
    .done(function(response){
      const items = response.response.body.items.item;

      const tempItem = items.find(item => item.category === 'T1H');

      if(tempItem){
        const temp = tempItem.obsrValue;
        const baseDay = tempItem.baseDate.slice(-2);
        // console
        console.log('실시간 날짜:', baseDay);
        console.log('실시간 기온:', temp, '°C');

        $('#baseDay').text(baseDay + '일');
        $('#temp').text(temp + '°C');
      }
      else{
        console.log('실시간 기온 정보 없음.');
      };
    })
    .fail(function(error){
      console.log('초단기실황 API 요청 중 오류 발생', error);
    });
  };

  function WeatherApi2(){  // 초단기예보 API 호출
    const { baseDate, baseTime } = getBaseDateTime(45);

    $.getJSON(apiUrl2, {
      ServiceKey: serviceKey,
      pageNo: pageNo,
      numOfRows: numOfRows,
      dataType: 'JSON',
      base_date: baseDate,
      base_time: baseTime,
      nx: 59,
      ny: 122
    })
    .done(function(response){
      const items = response.response.body.items.item;
      const skyItem = items.find(item => item.category === 'SKY');

      if(skyItem){
        const sky = skyItem.fcstValue;
        const weatherIcon = weatherIcons[sky];
        // console
        console.log('하늘 상태:', sky);

        if(weatherIcon){
          $('#fcstSky').html(`<img src="./images/${weatherIcon}.gif" alt="weather icon">`);
        }
        else{
          $('#fcstSky').text('날씨 아이콘 없음');
        };
      }
      else{
        console.log('초단기예보 날씨 정보 없음');
      };
    })
    .fail(function(error){
      console.log('초단기예보 API 요청 중 오류 발생', error);
    });
  };
  
 const weatherIcons = {
  1 : 'sunny',
  3 : 'cloudy',
  4 : 'rainy'
 };

 // 함수 호출
 WeatherApi1();
 WeatherApi2();
});
