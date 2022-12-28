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
}