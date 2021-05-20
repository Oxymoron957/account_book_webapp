
var ctx = document.getElementById('myChart').getContext('2d');
function fillChart(d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11,d12){
  var chart = new Chart(ctx, {
    // 챠트 종류를 선택
    type: 'line',
    // 챠트를 그릴 데이타
    data: {
      labels: ['1', '2', '3', '4', '5', '6', '7','8','9','10','11','12'],
      datasets: [{
        label: '월별 소비액',
        backgroundColor: 'transparent',
      //   backgroundColor: 'black',
        borderColor: 'blue',
        data: [d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11,d12]
      }]
    },
    // 옵션
    options: {
        responsive: false,
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
          },
    }
  });
}
