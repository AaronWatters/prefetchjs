

class MockWorker {
    onmessage: (event: any) => void;
    lastmessage: any;
    fakeresponse: any;
    constructor(url: string | Blob) {
        this.onmessage = () => {};
        this.lastmessage = null;
        this.fakeresponse = null;
    };
    postMessage(message: any) {       
        console.log('mock worker postMessage', message); 
        //this.onmessage({ data: message });
        this.lastmessage = message;
        // simulate a response
        setTimeout(() => {
            console.log('mock worker responding', this.fakeresponse);
            console.log('  onmessage', this.onmessage);
            this.onmessage(this.fakeresponse);
        }
        , 0);
    };

    terminate() {};
};

// mock the Worker class
global.Worker = MockWorker as any;
