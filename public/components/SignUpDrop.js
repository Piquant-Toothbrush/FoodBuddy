class SignUpDrop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      files: []
    };
  }

  uploadFile(event) {
    var fd = ('file', this.refs.file.getDOMNode().file[0]);

    $.ajax({
      url: 'https://floating-ravine-23725.herokuapp.com/Upload',
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: data =>{
        console.log(data);
      }
    });
    event.preventDefault()
  }

  render() {
    return (
      <div>
        <form ref='uploadForm' className='uploader' encType='multipart/form-data'>
          <input ref='file' type='file' name='file' className='upload-file' />
          <input type='button' ref='button' value='Upload' onClick={this.uploadFile} />
        </form>
      </div>
    );
  }

}

window.SignUpDrop = SignUpDrop;