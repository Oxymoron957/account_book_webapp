var ctx = document.getElementById('myChart').getContext('2d');

var chart = new Chart(ctx, {
    // 챠트 종류를 선택
    type: 'line',

    // 챠트를 그릴 데이타
    data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
        label: 'My First dataset',
        backgroundColor: 'transparent',
        borderColor: 'red',
        data: [0, 10, 5, 2, 20, 30, 45]
    }]
    },
    // 옵션
    options: {}
});