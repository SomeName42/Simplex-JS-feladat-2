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


let subject_rows = {}


function minutes_to_string(t) {
    return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String((t % 60)).padStart(2, '0')
}


function on_drag_start(e) {
    e.dataTransfer.setData("text", e.originalTarget.innerText)
}


function on_drop(e) {
    e.preventDefault();
    if(e.target.textContent == "") {
        let subject = e.dataTransfer.getData("text");
        e.target.textContent = subject;
        e.target.setAttribute("rowspan", subject_rows[subject])

        let t_col_i = Number(e.target.attributes.col_i.value) + 1;
        let t_row_i = Number(e.target.parentElement.attributes.row_i.value);
        let table = e.target.parentElement.parentElement;

        for(let row_i = t_row_i + 1; row_i < t_row_i + subject_rows[subject]; ++row_i) {
            table.children[row_i].children[t_col_i].setAttribute("class", "d-none")
        }
    }
}


function on_drag_over(e) {
    e.preventDefault();
}


$(document).ready(function() {
    for(let t = 8 * 60; t < 16 * 60; t += cell_size) {
        let row = $(`<tr class="text-center" row_i=${(t - 8 * 60)/cell_size}></tr>`);

        row.append(`<th scope="col">${minutes_to_string(t)}</th>`);

        for(let d = 0; d < 5; ++d) {
            row.append(`<td ondrop="on_drop(event)" ondragover="on_drag_over(event)" col_i=${d}></td>`)
        }

        $("#time_table_body").append(row);
    }

    subjects.forEach((subject) => {
        subject_rows[subject[0]] = subject[1] / cell_size;
        $("#subjects_table_body").append(`<tr class = "text-center align-middle"><td>${minutes_to_string(subject[1])}</td><td draggable="true" class = "movable" ondragstart="on_drag_start(event)">${subject[0]}</td></tr>`)
    })
});
