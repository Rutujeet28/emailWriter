// Main React App component for the Email Reply Generator
import { useState } from 'react'
import './App.css'
import { Box, Button, CircularProgress, Container, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';

/**
 * Main App component that provides the email reply generation interface
 * Uses Material-UI components for styling and axios for API communication
 */
function App() {
  // State management for form inputs and application state
  const [emailContent, setEmailContent] = useState(''); // Stores the original email content
  const [tone, setTone] = useState(''); // Stores the selected tone preference
  const [generatedReply, setGeneratedReply] = useState(''); // Stores the AI-generated reply
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(''); // Error state for displaying error messages

  /**
   * Handles the form submission to generate email replies
   * Makes API call to the Spring Boot backend service
   */
  const handleSubmit = async () => {
    setLoading(true); // Start loading state
    setError(''); // Clear any previous errors
    try {
      // Make POST request to the backend API
      const response = await axios.post("http://localhost:8080/api/email/generate", {
       emailContent,
       tone 
      });
      // Set the generated reply, handling both string and object responses
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      // Handle API errors
      setError('Failed to generate eamil reply. Please try again');
      console.error(error);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    // Main container with responsive max width and padding
    <Container maxWidth="md" sx={{py:4}}>
      {/* Application title */}
      <Typography variant='h3' component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      {/* Form section with margin */}
      <Box sx={{ mx: 3 }}>
        {/* Text area for original email content input */}
        <TextField 
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label="Original Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb:2 }}/>

          {/* Dropdown for tone selection */}
          <FormControl fullWidth sx={{ mb:2 }}>
            <InputLabel>Tone (Optional)</InputLabel>
            <Select
              value={tone || ''}
              label={"Tone (Optional)"}
              onChange={(e) => setTone(e.target.value)}>
                <MenuItem value="">None</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
            </Select>
          </FormControl>

          {/* Submit button with loading state */}
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={!emailContent || loading} // Disable if no content or loading
            fullWidth>
            {loading ? <CircularProgress size={24}/> : "Generate Reply"}
          </Button>
      </Box>

      {/* Error message display */}
      {error && (
        <Typography color='error' sx={{ mb:2 }}>
          {error}
        </Typography>
      )}

      {/* Generated reply display section */}
      {generatedReply && (
       <Box sx={{ mt: 3}}>
          <Typography variant='h6' gutterBottom>
            Generated Reply:
          </Typography>
          {/* Read-only text area showing the generated reply */}
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            value={generatedReply || ''}
            inputProps={{ readOnly: true }}/>
        
        {/* Copy to clipboard button */}
        <Button
          variant='outlined'
          sx={{ mt: 2 }}
          onClick={() => navigator.clipboard.writeText(generatedReply)}>
            Copy to Clipboard
        </Button>
       </Box> 
      )}
    </Container>
  )
}

export default App
