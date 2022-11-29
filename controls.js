class Controls{
    constructor(type){
        this.forward = false
        this.left = false
        this.right = false
        this.reverse = false

        switch(type){
            case 'KEYS':
                this.#addKeyboardListeners()
                break
            case 'DUMMY':
                this.forward = true
                break

        }

    }
    //this is a private method #
    #addKeyboardListeners(){
        document.onkeydown = (event) => {
            //switch case beacuse it depends on the key being presed
            switch(event.key){
                case 'ArrowLeft':
                    this.left = true
                    break
                case 'ArrowRight':
                    this.right = true
                    break
                case 'ArrowUp':
                    this.forward = true
                    break
                case 'ArrowDown':
                    this.reverse = true
                    break
                }
                // to debbug i console the keys
                //console.table(this)
        }
        // When you stop pressing a key
        document.onkeyup = (event) => {
            //switch case beacuse it depends on the key being presed
            switch(event.key){
                case 'ArrowLeft':
                    this.left = false
                    break
                case 'ArrowRight':
                    this.right = false
                    break
                case 'ArrowUp':
                    this.forward = false
                    break
                case 'ArrowDown':
                    this.reverse = false
                    break
                }
                // to debbug i console the keys
                //console.table(this)
        }
    }
}