let isEditMode = false;
let currentEditTable = null;

const tables = {
    left: [
        { tableNumber: 1, guests: [] },
        { tableNumber: 2, guests: [] },
        { tableNumber: 3, guests: [] },
        { tableNumber: 4, guests: [] },
        { tableNumber: 5, guests: [] },
        { tableNumber: 6, guests: [] },
        { tableNumber: '預備桌', guests: [] },
    ],
    center: [
        {
            tableNumber: '主桌', guests: [
                { name: '新娘', checkedIn: false },
                { name: '新郎', checkedIn: false },
                { name: '新娘媽媽', checkedIn: false },
                { name: '新娘爸爸', checkedIn: false },
                { name: '新郎媽媽', checkedIn: false },
                { name: '新郎爸爸', checkedIn: false },
                { name: '新娘奶奶', checkedIn: false },
                { name: '新娘舅舅', checkedIn: false },
                { name: '新郎長輩1', checkedIn: false },
                { name: '新郎長輩2', checkedIn: false },
            ]
        },
        { tableNumber: 7, guests: [] },
        { tableNumber: 8, guests: [] },
        { tableNumber: 9, guests: [] },
        { tableNumber: 10, guests: [] },
        { tableNumber: 11, guests: [] },
    ],
    right: [
        { tableNumber: 12, guests: [] },
        { tableNumber: 13, guests: [] },
        { tableNumber: 14, guests: [] },
        {
            tableNumber: 15, guests: [
                { name: '黃羿涵', checkedIn: false },
                { name: '蘇家慧', checkedIn: false },
                { name: '黃子宸（院長一家）', checkedIn: false },
                { name: '黃美萍', checkedIn: false },
                { name: '王宏為', checkedIn: false },
                { name: '王思涵', checkedIn: false },
                { name: '陳姿彤', checkedIn: false },
                { name: '陳羿妏', checkedIn: false },
                { name: '張尹瑄', checkedIn: false },
                { name: '張尹瑄男朋友', checkedIn: false },
            ]
        },
        {
            tableNumber: 16, guests: [
                { name: '蔡依靜', checkedIn: false },
                { name: '蔡依靜男朋友', checkedIn: false },
                { name: '蔡涵羽', checkedIn: false },
                { name: '鄧鎧萱', checkedIn: false },
                { name: '周郁玲', checkedIn: false },
                { name: '林依妮', checkedIn: false },
                { name: '柯妤含', checkedIn: false },
                { name: '劉佩琪', checkedIn: false },
                { name: '楊旂', checkedIn: false },
                { name: '劉致佑', checkedIn: false },
            ]
        },
        {
            tableNumber: 17, guests: [
                { name: '何禎', checkedIn: false },
                { name: '張芷嘉', checkedIn: false },
                { name: '張志嘉', checkedIn: false },
                { name: '陳振山', checkedIn: false },
                { name: '閔世維', checkedIn: false },
                { name: '陳柔妏', checkedIn: false },
                { name: '馮冠維', checkedIn: false },
                { name: '陳玉芬', checkedIn: false },
                { name: '蕭舒云', checkedIn: false },
                { name: '黃湘紋', checkedIn: false },
            ]
        },
    ]
};

function renderTables() {
    const containerLeft = document.getElementById('table-container-left');
    const containerCenter = document.getElementById('table-container-center');
    const containerRight = document.getElementById('table-container-right');

    containerLeft.innerHTML = '';
    containerCenter.innerHTML = '';
    containerRight.innerHTML = '';

    // 左欄 1-6 + 預備桌
    const leftTables = tables.left.filter(t => t.tableNumber !== '預備桌');
    const prepTable = tables.left.find(t => t.tableNumber === '預備桌');

    leftTables.forEach(table => {
        containerLeft.appendChild(createTableDiv(table));
    });
    if (prepTable) {
        containerLeft.appendChild(createTableDiv(prepTable));
    }

    // 中間 主桌 + 7-11
    const mainTable = tables.center.find(t => t.tableNumber === '主桌');
    const centerTables = tables.center.filter(t => t.tableNumber !== '主桌');

    if (mainTable) {
        containerCenter.appendChild(createTableDiv(mainTable));
    }
    centerTables.forEach(table => {
        containerCenter.appendChild(createTableDiv(table));
    });

    // 右欄 12-17
    tables.right.forEach(table => {
        containerRight.appendChild(createTableDiv(table));
    });
}

function createTableDiv(table) {
    const div = document.createElement('div');
    div.className = 'table-circle';
    const checkedInCount = table.guests.reduce((acc, g) => acc + (g.checkedIn ? 1 : 0), 0);
    div.innerHTML = `${table.tableNumber}<div class="status">已簽到：${checkedInCount}/${table.guests.length}</div>`;
    div.onclick = () => openModal(table);
    return div;
}

function openModal(table) {
    const modal = document.getElementById('modal');
    const overlay = document.getElementById('overlay');
    const guestList = document.getElementById('guest-list');
    const guestEditList = document.getElementById('guest-edit-list');
    const modalTitle = document.getElementById('modal-title');
    const addGuestBtn = document.getElementById('add-guest-btn');

    modalTitle.textContent = `桌子 ${table.tableNumber}`;

    if (!isEditMode) {
        guestList.style.display = 'flex';
        guestEditList.style.display = 'none';
        addGuestBtn.style.display = 'none';

        guestList.innerHTML = '';

        table.guests.forEach((guest) => {
            const guestDiv = document.createElement('div');
            guestDiv.className = 'guest';
            guestDiv.textContent = guest.name;
            if (guest.checkedIn) {
                guestDiv.classList.add('checked-in');
            }
            guestDiv.onclick = () => {
                guest.checkedIn = !guest.checkedIn;
                guestDiv.classList.toggle('checked-in');
                renderTables();
            };
            guestList.appendChild(guestDiv);
        });
    } else {
        guestList.style.display = 'none';
        guestEditList.style.display = 'block';
        addGuestBtn.style.display = 'inline-block';

        renderGuestEditList(table.guests);
    }

    modal.style.display = 'block';
    overlay.style.display = 'block';

    currentEditTable = table;
}

function renderGuestEditList(guests) {
    const guestEditList = document.getElementById('guest-edit-list');
    guestEditList.innerHTML = '';

    guests.forEach((guest, idx) => {
        const guestDiv = document.createElement('div');
        guestDiv.className = 'guest-edit';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = guest.name;
        input.placeholder = '輸入來賓名字';
        input.autocomplete = "off";
        input.spellcheck = false;
        input.inputMode = "text";
        input.oninput = (e) => {
            guest.name = e.target.value;
        };

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-guest';
        delBtn.textContent = '刪除';
        delBtn.onclick = () => {
            guests.splice(idx, 1);
            renderGuestEditList(guests);
        };

        guestDiv.appendChild(input);
        guestDiv.appendChild(delBtn);
        guestEditList.appendChild(guestDiv);
    });
}

document.getElementById('add-guest-btn').addEventListener('click', () => {
    if (!currentEditTable) return;
    currentEditTable.guests.push({ name: '', checkedIn: false });
    renderGuestEditList(currentEditTable.guests);
});

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    currentEditTable = null;
}

function searchGuest() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const results = document.getElementById('search-results');
    results.innerHTML = '';

    if (query === '') {
        results.innerHTML = '';
        return;
    }

    Object.entries(tables).forEach(([sectionKey, tableArray]) => {
        tableArray.forEach(table => {
            table.guests.forEach(guest => {
                if ((guest.name || '').toLowerCase().includes(query)) {
                    const resultDiv = document.createElement('div');
                    resultDiv.className = 'search-result';
                    resultDiv.textContent = `${guest.name} - 桌子 ${table.tableNumber}`;
                    if (guest.checkedIn) {
                        resultDiv.classList.add('checked-in');
                    }
                    resultDiv.onclick = () => {
                        guest.checkedIn = !guest.checkedIn;
                        resultDiv.classList.toggle('checked-in');
                        renderTables();
                    };
                    results.appendChild(resultDiv);
                }
            });
        });
    });
}

const editModeToggleBtn = document.getElementById('edit-mode-toggle');
editModeToggleBtn.onclick = function () {
    if (!isEditMode) {
        isEditMode = true;
        editModeToggleBtn.classList.add('editing');
        document.getElementById('search-bar').value = '';
        document.getElementById('search-results').innerHTML = '';
    } else {
        isEditMode = false;
        editModeToggleBtn.classList.remove('editing');
        closeModal();
        renderTables();
    }
};

renderTables();