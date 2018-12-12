new Vue({
    el: '#app',
    data: {
        image: '',
        testImage: "",
        number: "0"
    },
    methods: {
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            this.createImage(files[0]);
        },
        createImage(file) {
            var image = new Image();
            var reader = new FileReader();
            var vm = this;

            reader.onload = (e) => {
                vm.image = e.target.result;
            };
            //reader.onload = (e) => this.$emit("load", e.target.result);
                //vm.image = e.target.result;
            //this.testImage = reader.readAsArrayBuffer(vm.image);
            reader.readAsDataURL(file);
            this.image = vm.image;
            //console.log(this.image);
        },
        removeImage: function (e) {
            this.image = '';
        },
        train: function() {
            // POST request
            this.$http.post('/training')
            //method: 'POST'
                .then(response => {
                    console.log('ok');
                });
        },
        test: function() {
            // POST request
            //let formData = new FormData();
            //formData.append("myFile", this.number, this.number.name);
            //this.testImage = reader.readAsArrayBuffer(this.image);
            if (number == 0) {
                this.$http.post('/testing')
                //method: 'POST'
                    .then(response => {
                        console.log('ok');
                    });
                number = 1;
            }
        }
    }
})
