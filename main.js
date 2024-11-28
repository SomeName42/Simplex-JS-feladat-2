function minutes_to_string(t) {
    return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String((t % 60)).padStart(2, '0')
}

$(document).ready(function() {
    let subjects = [
        ["Math", 90],
        ["PE", 30],
        ["History", 60],
        ["Grammar", 30],
        ["Literature", 30],
        ["Physics", 90],
        ["Chemistry", 90],
        ["Programming", 120],
        ["Biology", 90]
    ];

    let cell_size = 30;

    for(let t = 8 * 60; t < 16 * 60; t += cell_size) {
        let row = $('<tr></tr>');

        row.append(`<th scope="col" class="text-center" >${minutes_to_string(t)}</th>`);

        for(let d = 0; d < 5; ++d) {
            row.append('<td></td>')
        }

        $("#time_table_body").append(row);
    }

    subjects.forEach((subject) => {
        $("#subjects_table_body").append(`<tr class = "text-center align-middle"><td>${minutes_to_string(subject[1])}</td><td draggable="true" style = "height: ${subject[1]/cell_size * 40}px" >${subject[0]}</td></tr>`)
    })
});
