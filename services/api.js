const api = {
    baseURL: 'http://localhost:5000/api',
    
    async get(url) {
      try {
        const response = await fetch(this.baseURL + url, {
          headers: this.getHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return {
          data: await response.json()
        };
      } catch (error) {
        console.error('API GET error:', error);
        throw error;
      }
    },
    
    async post(url, data) {
      try {
        const response = await fetch(this.baseURL + url, {
          method: 'POST',
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          const error = new Error(errorData.message || 'API Error');
          error.response = {
            data: errorData,
            status: response.status
          };
          throw error;
        }
        
        return {
          data: await response.json()
        };
      } catch (error) {
        console.error('API POST error:', error);
        throw error;
      }
    },
    
    getHeaders() {
      const headers = {};
      const token = localStorage.getItem('token');
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      return headers;
    },
    
    setAuthHeader(token) {
      this.defaults = {
        ...this.defaults,
        headers: {
          ...this.defaults?.headers,
          common: {
            ...this.defaults?.headers?.common,
            Authorization: `Bearer ${token}`
          }
        }
      };
    },
    
    defaults: {
      headers: {
        common: {}
      }
    }
  };
  
  export default api;