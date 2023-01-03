class RequestMappingUtils {
	constructor()
	{
		
	}
	
	static Post(url, json) {
		fetch(url, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: json
        });
	}
	
	static PostWithResponse(url, json, callback) {
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
}