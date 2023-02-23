class RequestMappingUtils {
    constructor() {

    }

    static post(url, json) {
        const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfToken
            },
            body: json
        });
    }

    static postWithResponse(url, json, callback) {
        const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfToken
            },
            body: json
        }).then(
            response => {
                if (response.status === 200) {
                    response.json().then(json => {
                        callback(json);
                    });
                }
            }
        ).then(
            html => console.log(html)
        );
    }

    static postWithoutBodyResponse(url, callback) {
        const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        fetch(url, {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': csrfToken
            }
        }).then(
            response => {
                if (response.status === 200) {
                    callback(response);
                }
            }
        ).then(
            html => console.log(html)
        );
    }

    static get(url, callback) {
        fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            response => {
                if (response.status === 200) {
                    response.json().then(json => {
                        callback(json);
                    });
                }
            }
        ).then(
            html => console.log(html)
        );
    }
}