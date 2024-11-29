const subjects = [
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


const cell_size = 30;
const start_h = 8;
const end_h = 16;

const subjects_rows = {};
const saves = {};


function minutes_to_string(t) {
    return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String((t % 60)).padStart(2, '0')
}


function add_subject(s_row_i, s_col_i, subject) {
    const subject_rows = subjects_rows[subject];

    if(subject_rows === undefined) {
        return;
    }

    const table = $("#time_table_body")[0];

    if(table.children.length < s_row_i + subject_rows) {
        return;
    }

    const cell = table.children[s_row_i].children[s_col_i + 1];

    if(cell.textContent != "") {
        return;
    }

    for(let row_i = s_row_i + 1; row_i < s_row_i + subject_rows; ++row_i) {
        if(table.children[row_i].children[s_col_i + 1].textContent != "") {
            return;
        }
    }

    cell.textContent = subject;
    cell.setAttribute("rowspan", subject_rows);
    cell.setAttribute("class", "draggable");
    cell.setAttribute("draggable", "true");
    cell.setAttribute("ondragstart", "on_time_table_drag_start(event)");

    for(let row_i = s_row_i + 1; row_i < s_row_i + subject_rows; ++row_i) {
        table.children[row_i].children[s_col_i + 1].setAttribute("class", "d-none");
    }
}


function remove_subject(s_row_i, s_col_i) {
    const table = $("#time_table_body")[0];
    const cell = table.children[s_row_i].children[s_col_i + 1];
    const subject_rows = subjects_rows[cell.textContent];

    cell.textContent = "";
    cell.setAttribute("rowspan", "");
    cell.setAttribute("class", "");
    cell.setAttribute("draggable", "");
    cell.setAttribute("ondragstart", "");

    for(let row_i = s_row_i + 1; row_i < s_row_i + subject_rows; ++row_i) {
        table.children[row_i].children[s_col_i + 1].setAttribute("class", "");
    }
}


function on_subjects_drag_start(e) {
    e.dataTransfer.setData("text", e.originalTarget.innerText);
}


function on_time_table_drag_start(e) {
    e.dataTransfer.setData("text", e.originalTarget.innerText);

    const s_row_i = Number(e.target.parentElement.attributes.row_i.value);
    const s_col_i = Number(e.target.attributes.col_i.value);

    remove_subject(s_row_i, s_col_i);
}



function on_drop(e) {
    e.preventDefault();

    const s_row_i = Number(e.target.parentElement.attributes.row_i.value);
    const s_col_i = Number(e.target.attributes.col_i.value);
    const subject = e.dataTransfer.getData("text");

    add_subject(s_row_i, s_col_i, subject);
}


function on_drag_over(e) {
    e.preventDefault();
}


function on_save_click() {
    const save_name = $("#save_name").val();

    if(save_name == "") {
        return;
    }

    const load_select = $("#load_select");

    load_select.append($(`<option>${save_name}</option>`));
    load_select.prop("disabled", false);

    $("#load_button").prop("disabled", false);
    $("#delete_button").prop("disabled", false);

    const table = $("#time_table_body")[0];

    const save = [];

    for(let t = start_h * 60; t < end_h * 60; t += cell_size) {
        const row_i = (t - start_h * 60) / cell_size;
        const row = table.children[row_i].children;

        for(let col_i = 0; col_i < 5; ++col_i) {
            const subject = row[col_i + 1].textContent;

            if(subject != "") {
                save.push([row_i, col_i, subject]);
            }
        }
    }

    saves[save_name] = save;
}


function on_delete_click() {
    const load_select = $("#load_select")[0];
    const selected = load_select.children[load_select.selectedIndex];
    const save_name = selected.textContent;

    delete saves[save_name];
    selected.remove();

    if(load_select.children.length == 0) {
        $("#load_select").prop("disabled", true);
        $("#load_button").prop("disabled", true);
        $("#delete_button").prop("disabled", true);
    }
}


function on_load_click() {
    const table = $("#time_table_body")[0];

    for(let t = start_h * 60; t < end_h * 60; t += cell_size) {
        const row_i = (t - start_h * 60) / cell_size;
        const row = table.children[row_i].children;

        for(let col_i = 0; col_i < 5; ++col_i) {
            const subject = row[col_i + 1].textContent;

            if(subject != "") {
                remove_subject(row_i, col_i);
            }
        }
    }

    const save = saves[$("#load_select")[0].children[load_select.selectedIndex].textContent]

    save.forEach((s) => {
        add_subject(s[0], s[1], s[2]);
    });
}


$(document).ready(function() {
    for(let t = start_h * 60; t < end_h * 60; t += cell_size) {
        const row = $(`<tr class="text-center" row_i=${(t - start_h * 60) / cell_size}></tr>`);

        row.append(`<th scope="col">${minutes_to_string(t)}</th>`);

        for(let d = 0; d < 5; ++d) {
            row.append(`<td ondrop="on_drop(event)" ondragover="on_drag_over(event)" col_i=${d}></td>`);
        }

        $("#time_table_body").append(row);
    }

    subjects.forEach((subject) => {
        subjects_rows[subject[0]] = subject[1] / cell_size;
        $("#subjects_table_body").append(`<tr class = "text-center align-middle"><td>${minutes_to_string(subject[1])}</td><td draggable="true" class = "draggable" ondragstart="on_subjects_drag_start(event)">${subject[0]}</td></tr>`);
    })

    $("#save_button").click(on_save_click);
    $("#delete_button").click(on_delete_click);
    $("#load_button").click(on_load_click);
});
