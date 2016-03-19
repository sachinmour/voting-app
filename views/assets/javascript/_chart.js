var ctx = document.getElementById("chart").getContext("2d");
var data = {
    labels: ["January", "February"],
    datasets: [
        {
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [65, 59]
        }
    ]
};

var myBarChart = new Chart(ctx).Bar(data);