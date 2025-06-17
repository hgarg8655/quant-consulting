// public/script.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('UL_FORM_eda93a98-3047-43c2-b6af-735540a16aa9');
  form.addEventListener('submit', async e => {
    e.preventDefault();

     const name        = form.querySelector('input[name="name"]').value.trim();
    const to          = form.querySelector('input[name="to"]').value.trim();
    const fromPhone   = form.querySelector('input[name="from_phone"]').value.trim();
    const message     = form.querySelector('textarea[name="message"]').value.trim();

     if (!name) {
      alert('Name is required.');
      return;
    }

    if (!to) {
      alert('Email is required.');
      return;
    }
   
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(to)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!fromPhone) {
      alert('Phone number is required.');
      return;
    }

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(fromPhone)) {
      alert('Please enter a 10-digit phone number (no dashes or spaces).');
      return;
    }

    if (!message) {
      alert('Message cannot be empty.');
      return;
    }
    
    const fileInput = form.querySelector('input[name="attachment"]');
    const file = fileInput.files[0];
    if(!file){
      alert('Attachment must be a PDF or DOCX file.');
        return;
    }
    if (file) {
      const allowedMimes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedMimes.includes(file.type)) {
        alert('Attachment must be a PDF or DOCX file.');
        return;
      }
    }

    const formData = new FormData(form);

    try {
      const res = await fetch('/send-email', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      alert(json.success ? 'Email sent!' : 'Error: ' + json.error);
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  });
});
