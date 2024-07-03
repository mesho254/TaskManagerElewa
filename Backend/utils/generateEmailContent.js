const generateEmailContent = ( title, description, dueDate) => {
    const logoUrl = 'http://localhost:5000/public/logo.png'; // Adjust this URL based on your actual server configuration
  
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>You've been assigned a new task:</p>
        <img src="${logoUrl}" alt="Logo" style="width: 100px; height: auto;">
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Deadline:</strong> ${new Date(dueDate).toLocaleString()}</p>
        <br>
        <p>Regards,</p>
        <p>Meshak Okello,</p>
        <p>Elewa Admin</p>
        <div>
          <a href="https://www.facebook.com"><img src="http://localhost:5000/public/facebook-icon.png" alt="Facebook" style="width: 24px; height: 24px;"></a>
          <a href="https://www.twitter.com"><img src="http://localhost:5000/public/twitter-icon.png" alt="Twitter" style="width: 24px; height: 24px;"></a>
          <a href="https://www.linkedin.com"><img src="http://localhost:5000/public/linkedin-icon.png" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
        </div>
      </div>
    `;
  
    const text = `
      You've been assigned a new task:
      Title: ${title}
      Description: ${description}
      Deadline: ${new Date(dueDate).toLocaleString()}
  
      Regards,
      Meshak Okello,
      Elewa Admin
  
      Facebook: https://www.facebook.com
      Twitter: https://www.twitter.com
      LinkedIn: https://www.linkedin.com
    `;
  
    return { htmlContent, text };
  };
  
  module.exports = generateEmailContent;
  