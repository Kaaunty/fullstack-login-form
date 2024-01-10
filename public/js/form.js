// form loading animation

const form = [...document.querySelector('.form').children];

form.forEach((item, i) => {
    setTimeout(() => {
        item.style.opacity = 1;
    }, i * 100);
});

window.onload = () => {
    if (sessionStorage.name) {
        location.href = '/';
    }
};

const nameUser = document.querySelector('.name');
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const submitBtn = document.querySelector('.submit-btn');

if (nameUser == null) {
    submitBtn.addEventListener('click', () => {
        fetch('/login-user', {
            method: 'post',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                validateData(data);
            });
    });
} else {
    submitBtn.addEventListener('click', () => {
        fetch('/register-user', {
            method: 'post',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                name: nameUser.value,
                email: email.value,
                password: password.value,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                validateData(data);
            });
    });
}

const validateData = (data) => {
    if (!data.name) {
        alertBox(data);
    } else {
        sessionStorage.name = data.name;
        sessionStorage.email = data.email;
        location.href = '/';
    }
};

const alertBox = (data) => {
    const alertContainer = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');
    alertMsg.innerHTML = data;

    alertContainer.style.top = `5%`;
    setTimeout(() => {
        alertContainer.style.top = null;
    }, 5000);
};
