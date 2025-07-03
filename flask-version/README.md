# FireMon Security Intelligence - Flask Version

A Flask web application for analyzing FireMon firewall rules with natural language queries.

## Features

- 🔍 **Natural Language Queries** - Search for firewall rules using plain English
- 📊 **Device Management** - Browse and filter through 250+ network devices
- 📈 **Detailed Analytics** - Comprehensive rule analysis with statistics
- 📤 **Data Export** - Export results to CSV format
- 🎨 **Modern Dark UI** - Beautiful, responsive design with dark theme
- ⚡ **Fast Performance** - Optimized for large datasets

## File Structure

```
NET_FLASK/
├── static/
│   ├── css/
│   │   └── style.css          # Main stylesheet with dark theme
│   └── js/
│       └── main.js            # JavaScript functionality
├── templates/
│   ├── base.html              # Base template with common layout
│   ├── index.html             # Landing page with search interface
│   ├── devices.html           # Device listing page
│   └── results.html           # Query results display
├── venv/                      # Virtual environment (create this)
├── app.py                     # Main Flask application
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## Quick Start

1. **Create virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**

   ```bash
   python app.py
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5000`

## Usage

### 1. Search for Rules

- Enter a natural language query on the homepage
- Use predefined queries or create your own
- Examples:
  - "Show all firewall rules where source, destination, and service are set to 'Any'"
  - "List unused rules from the last 90 days"
  - "Find rules with high security severity"

### 2. Select Device

- Browse through the device list (250+ devices)
- Use filters to find specific devices by status or type
- Click on a device to run your query against it

### 3. View Results

- Analyze the comprehensive results table
- View statistics dashboard with key metrics
- Export results to CSV for further analysis

## API Endpoints

- `GET /` - Homepage with search interface
- `GET /devices?query=<query>` - Device listing page
- `GET /results?query=<query>&deviceId=<id>&deviceName=<name>` - Results page
- `GET /api/devices` - JSON API for device data
- `POST /api/query` - JSON API for query execution
- `GET /export?query=<query>&deviceId=<id>` - CSV export

## Customization

### Adding Real FireMon Integration

Replace the mock data generators in `app.py` with actual FireMon API calls:

```python
# Replace generate_mock_devices() with:
def get_real_devices():
    # Your FireMon API integration here
    firemon = FiremonAPI(host="your-host", verify=False).auth("user", "pass")
    devices = firemon.sm.devices.all()
    return devices

# Replace generate_mock_rules() with:
def execute_real_query(device_id, query):
    # Your SIQL query execution here
    rules = firemon.sm.siql.secrule(siql_query)
    return rules
```

### Styling Customization

Modify `static/css/style.css` to customize the appearance:

- Change color scheme by updating CSS variables
- Adjust layout and spacing
- Add custom animations and effects

### Adding Features

1. **User Authentication** - Add Flask-Login for user management
2. **Database Storage** - Use SQLAlchemy for persistent data
3. **Caching** - Add Redis for improved performance
4. **Real-time Updates** - Use WebSockets for live data

## Development

### Environment Variables

Create a `.env` file for configuration:

```env
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key
FIREMON_HOST=your-firemon-host
FIREMON_USER=your-username
FIREMON_PASS=your-password
```

### Testing

```bash
# Run with debug mode
export FLASK_ENV=development
python app.py

# Run tests (if you add them)
python -m pytest tests/
```

## Production Deployment

### Using Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Docker

Create a `Dockerfile`:

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

Build and run:

```bash
docker build -t firemon-flask .
docker run -p 5000:5000 firemon-flask
```

## Technology Stack

- **Backend:** Flask (Python)
- **Frontend:** HTML5, CSS3, JavaScript
- **Icons:** Lucide Icons
- **Styling:** Custom CSS with CSS Variables
- **Data:** Mock data (easily replaceable with real FireMon API)

## License

This project is licensed under the MIT License.
