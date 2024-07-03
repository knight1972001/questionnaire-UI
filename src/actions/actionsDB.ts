export const getAllQuestions = async () => {
    try {
        // console.log("Getting all Question")
        const apiURL = `http://localhost:8000/questions/`
        // Assuming you want to parse the response as JSON
        const response = await fetch(apiURL, {
            method: 'GET',
        });
        const responseData = await response.json();
        // console.log(responseData.documents)
        return responseData
    } catch (err) {
        console.error(err);
    }
}

export const submitAllAnswer = async (answer: any) => {
    try {
        console.log("Submitted answers:", answer);
        const apiURL = `http://localhost:8000/submit`;

        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any additional headers if required
            },
            body: JSON.stringify(answer),
        });

        if (!response.ok) {
            throw new Error('Failed to submit answer');
        }

        // Optionally handle response data here if needed
        const responseData = await response.json();
        console.log('Submitted successfully:', responseData);

        return responseData; // Return any data you need after submission
    } catch (err) {
        console.error('Error submitting answer:', err);
        throw err; // Rethrow or handle the error as per your application's needs
    }
}