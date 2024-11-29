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


let subjects_rows = {}


function minutes_to_string(t) {
    return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String((t % 60)).padStart(2, '0')
}


function add_subject(s_row_i, s_col_i, subject) {
    let subject_rows = subjects_rows[subject];

    if(subject_rows === undefined) {
        return;
    }

    let table = $("#time_table_body")[0];

    if(table.children.length < s_row_i + subject_rows) {
        return;
    }

    let cell = table.children[s_row_i].children[s_col_i];

    if(cell.textContent != "") {
        return;
    }

    cell.textContent = subject;
    cell.setAttribute("rowspan", subject_rows);
    cell.setAttribute("class", "draggable");
    cell.setAttribute("draggable", "true");
    cell.setAttribute("ondragstart", "on_time_table_drag_start(event)");

    for(let row_i = s_row_i + 1; row_i < s_row_i + subject_rows; ++row_i) {
        table.children[row_i].children[s_col_i].setAttribute("class", "d-none");
    }
}


function remove_subject(s_row_i, s_col_i) {
    let table = $("#time_table_body")[0];
    let cell = table.children[s_row_i].children[s_col_i];
    let subject_rows = subjects_rows[cell.textContent];

    cell.textContent = "";
    cell.setAttribute("rowspan", "");
    cell.setAttribute("class", "");
    cell.setAttribute("draggable", "");
    cell.setAttribute("ondragstart", "");

    for(let row_i = s_row_i + 1; row_i < s_row_i + subject_rows; ++row_i) {
        table.children[row_i].children[s_col_i].setAttribute("class", "");
    }
}


function on_subjects_drag_start(e) {
    e.dataTransfer.setData("text", e.originalTarget.innerText);
}


function on_time_table_drag_start(e) {
    e.dataTransfer.setData("text", e.originalTarget.innerText);

    let s_row_i = Number(e.target.parentElement.attributes.row_i.value);
    let s_col_i = Number(e.target.attributes.col_i.value) + 1;

    remove_subject(s_row_i, s_col_i);
}



function on_drop(e) {
    e.preventDefault();

    let s_row_i = Number(e.target.parentElement.attributes.row_i.value);
    let s_col_i = Number(e.target.attributes.col_i.value) + 1;
    let subject = e.dataTransfer.getData("text");

    add_subject(s_row_i, s_col_i, subject);
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
        subjects_rows[subject[0]] = subject[1] / cell_size;
        $("#subjects_table_body").append(`<tr class = "text-center align-middle"><td>${minutes_to_string(subject[1])}</td><td draggable="true" class = "draggable" ondragstart="on_subjects_drag_start(event)">${subject[0]}</td></tr>`)
    })
});
