class RequestMappingUtils {
	constructor()
	{
		
	}
	
	static post(url, json) {
		fetch(url, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: json
        });
	}
	
	static postWithResponse(url, json, callback) {
		fetch(url, {
		    method: "POST",
		    headers: {
		      'Content-Type': 'application/json'
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