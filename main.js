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


function on_time_table_drag_end(e) {
    const o_row_i = e.dataTransfer.getData("o_row_i");
    const o_col_i = e.dataTransfer.getData("o_col_i");

    if(o_row_i != "") {
        const cell = $("#time_table_body")[0].children[Number(o_row_i)].children[Number(o_col_i) + 1];

        if(cell.attributes.remove_after_dragging.value != "") {
            cell.innerHTML = "";
            cell.setAttribute("remove_after_dragging", "");
        }
    }
}


function add_subject(s_row_i, s_col_i, subject) {
    const subject_rows = subjects_rows[subject];

    if(subject_rows == undefined) {
        return false;
    }

    const table = $("#time_table_body")[0];

    if(table.children.length < s_row_i + subject_rows) {
        $("#drag_error_too_long").toast("show");
        return false;
    }

    const cell = table.children[s_row_i].children[s_col_i + 1];

    if(cell.innerHTML != "") {
        $("#drag_error_occupied").toast("show");
        return false;
    }

    for(let row_i = s_row_i + 1; row_i < s_row_i + subject_rows; ++row_i) {
        if(table.children[row_i].children[s_col_i + 1].innerHTML != "") {
            $("#drag_error_occupied").toast("show");
            return false;
        }
    }

    cell.innerHTML = `<div class = "btn btn-primary draggable" draggable="true" ondragstart = "on_time_table_drag_start(event)" ondragend = "on_time_table_drag_end(event)" ondrop="on_drop(event)" ondragover="on_drag_over(event)">${subject}</div>`;
    cell.setAttribute("rowspan", subject_rows);

    for(let row_i = s_row_i + 1; row_i < s_row_i + subject_rows; ++row_i) {
        table.children[row_i].children[s_col_i + 1].setAttribute("class", "d-none");
    }

    return true;
}


function remove_subject(s_row_i, s_col_i, dragging) {
    const table = $("#time_table_body")[0];
    const cell = table.children[s_row_i].children[s_col_i + 1];
    const subject_rows = subjects_rows[cell.children[0].textContent];

    if(!dragging) {
        cell.innerHTML = "";
    } else {
        cell.setAttribute("remove_after_dragging", "true");
    }

    cell.setAttribute("rowspan", "");

    for(let row_i = s_row_i + 1; row_i < s_row_i + subject_rows; ++row_i) {
        table.children[row_i].children[s_col_i + 1].setAttribute("class", "");
    }
}


function on_subjects_drag_start(e) {
    e.dataTransfer.setData("text", e.target.innerText);
}


function on_time_table_drag_start(e) {
    e.dataTransfer.setData("text", e.target.innerText);
    const s_row_i = Number(e.target.parentElement.parentElement.attributes.row_i.value);
    const s_col_i = Number(e.target.parentElement.attributes.col_i.value);

    e.dataTransfer.setData("o_row_i", s_row_i);
    e.dataTransfer.setData("o_col_i", s_col_i);

    remove_subject(s_row_i, s_col_i, true);
}



function on_drop(e) {
    e.preventDefault();

    let cell;

    if(e.target.localName == "td") {
        cell = e.target;
    } else {
        cell = e.target.parentElement;
    }

    if(cell === null) {
        return;
    }

    let o_row_i = e.dataTransfer.getData("o_row_i");
    let o_col_i = e.dataTransfer.getData("o_col_i");

    if(o_row_i != "") {
        o_row_i = Number(o_row_i);
        o_col_i = Number(o_col_i);
        const cell = $("#time_table_body")[0].children[o_row_i].children[o_col_i + 1];
        cell.innerHTML = "";
        cell.setAttribute("remove_after_dragging", "");
    }

    const s_row_i = Number(cell.parentElement.attributes.row_i.value);
    const s_col_i = Number(cell.attributes.col_i.value);
    const subject = e.dataTransfer.getData("text");

    if(add_subject(s_row_i, s_col_i, subject)) {
        $("#drag_success").toast("show");
    } else if(o_row_i !== "") {
        add_subject(o_row_i, o_col_i, subject);
    }
}


function on_drag_over(e) {
    e.preventDefault();
}


function on_save_click() {
    const save_name = $("#save_name").val();

    if(save_name == "") {
        $("#save_error_empty").toast("show");
        return;
    }

    const load_select = $("#load_select");

    if(saves[save_name] == undefined) {
        load_select.append($(`<option>${save_name}</option>`));
    }

    load_select.prop("disabled", false);

    $("#load_button").prop("disabled", false);
    $("#delete_button").prop("disabled", false);

    const table = $("#time_table_body")[0];

    const save = [];

    for(let t = start_h * 60; t < end_h * 60; t += cell_size) {
        const row_i = (t - start_h * 60) / cell_size;
        const row = table.children[row_i].children;

        for(let col_i = 0; col_i < 5; ++col_i) {
            const children = row[col_i + 1].children;

            if(children.length > 0) {
                save.push([row_i, col_i, children[0].textContent]);
            }
        }
    }

    saves[save_name] = save;

    $("#save_success").toast("show");
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

        row.append(`<th scope="col" class = "py-3">${minutes_to_string(t)}</th>`);

        for(let d = 0; d < 5; ++d) {
            row.append(`<td ondrop="on_drop(event)" ondragover="on_drag_over(event)" col_i=${d}></td>`);
        }

        $("#time_table_body").append(row);
    }

    subjects.forEach((subject) => {
        subjects_rows[subject[0]] = subject[1] / cell_size;
        $("#subjects_table_body").append(`<tr class = "text-center align-middle"><td>${minutes_to_string(subject[1])}</td><td><div draggable="true" class = "draggable btn btn-primary" ondragstart="on_subjects_drag_start(event)">${subject[0]}</div></td></tr>`);
    })

    $("#save_button").click(on_save_click);
    $("#delete_button").click(on_delete_click);
    $("#load_button").click(on_load_click);
});
