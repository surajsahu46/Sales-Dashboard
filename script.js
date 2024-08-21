document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const githubIcon = document.getElementById('githubIcon');

  // Load dark mode preference from localStorage
  if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
      darkModeToggle.checked = true;
  }

  darkModeToggle.addEventListener('change', function() {
      if (darkModeToggle.checked) {
          document.body.classList.add('dark-mode');
          localStorage.setItem('darkMode', 'enabled');
      } else {
          document.body.classList.remove('dark-mode');
          localStorage.setItem('darkMode', 'disabled');
      }
  });

  // Rest of your existing code
});

document.addEventListener('DOMContentLoaded', function() {
  fetch('data.json')
      .then(response => response.json())
      .then(data => {
          window.salesData = data.sales;
          createSalesChart(salesData);
      });

  document.getElementById('monthFilter').addEventListener('change', function() {
      const selectedMonth = this.value;
      const filteredData = selectedMonth === 'all'
          ? salesData
          : salesData.filter(entry => entry.month === selectedMonth);
      createSalesChart(filteredData);
  });

  document.getElementById('addDataBtn').addEventListener('click', function() {
      const newMonth = document.getElementById('newMonth').value;
      const newRevenue = document.getElementById('newRevenue').value;

      if (newMonth && newRevenue) {
          salesData.push({ month: newMonth, revenue: Number(newRevenue) });
          createSalesChart(salesData);
      }
  });

  document.getElementById('chartType').addEventListener('change', function() {
      createSalesChart(salesData);
  });

  document.getElementById('colorPicker').addEventListener('input', function() {
      createSalesChart(salesData);
  });

  document.getElementById('downloadBtn').addEventListener('click', function() {
      const fileName = document.getElementById('fileName').value || 'sales-data';
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(salesData, null, 2));
      const dlAnchorElem = document.createElement('a');
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", fileName + ".json");
      dlAnchorElem.click();
  });
});

function createSalesChart(data) {
  const ctx = document.getElementById('salesChart').getContext('2d');
  const chartType = document.getElementById('chartType').value;
  const color = document.getElementById('colorPicker').value || '#4CAF50';

  new Chart(ctx, {
      type: chartType,
      data: {
          labels: data.map(entry => entry.month),
          datasets: [{
              label: 'Revenue',
              data: data.map(entry => entry.revenue),
              backgroundColor: color,
              borderColor: color,
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              x: {
                  beginAtZero: true
              },
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Fetch and load data from data.json
  fetch('data.json')
      .then(response => response.json())
      .then(data => {
          window.salesData = data.sales;
          createChart(salesData);
      });

  // Event listener for adding new data
  document.getElementById('addDataBtn').addEventListener('click', function() {
      const newMonth = document.getElementById('newMonth').value;
      const newRevenue = document.getElementById('newRevenue').value;

      if (newMonth && newRevenue) {
          salesData.push({ month: newMonth, revenue: Number(newRevenue) });
          createChart(salesData);
      }
  });

  // Event listener for updating revenue
  document.getElementById('updateRevenueBtn').addEventListener('click', function() {
      const monthToUpdate = document.getElementById('updateMonth').value;
      const newRevenueValue = document.getElementById('updateRevenue').value;

      updateRevenue(monthToUpdate, newRevenueValue);
  });

  // Event listener for chart type change
  document.getElementById('chartType').addEventListener('change', function() {
      createChart(salesData);
  });

  // Event listener for color picker change
  document.getElementById('colorPicker').addEventListener('input', function() {
      createChart(salesData);
  });

  // Event listener for download button
  document.getElementById('downloadBtn').addEventListener('click', function() {
      const fileName = document.getElementById('fileName').value || 'sales-chart';
      const link = document.createElement('a');
      link.href = document.getElementById('salesChart').toDataURL();
      link.download = `${fileName}.png`;
      link.click();
  });

  // Event listener for product comparison
  document.getElementById('compareProduct').addEventListener('change', function() {
      const selectedProduct = this.value;
      const comparisonData = selectedProduct === 'product1' ? product1Data : selectedProduct === 'product2' ? product2Data : salesData;
      createComparisonChart(comparisonData);
  });

  // Event listener for month filter
  document.getElementById('monthFilter').addEventListener('change', function() {
      const selectedMonth = this.value;
      const filteredData = selectedMonth === 'all'
          ? salesData
          : salesData.filter(entry => entry.month === selectedMonth);
      createChart(filteredData);
  });
});

// Function to update revenue for a specific month
function updateRevenue(month, newRevenue) {
  if (isNaN(newRevenue) || newRevenue < 0) {
      console.error("Invalid revenue value.");
      return;
  }

  const entryIndex = salesData.findIndex(entry => entry.month === month);

  if (entryIndex !== -1) {
      salesData[entryIndex].revenue = Number(newRevenue);
      createChart(salesData);
  } else {
      console.error("Month not found in data.");
  }
}

// Function to calculate and display insights
function calculateInsights(data) {
  const totalRevenue = data.reduce((sum, entry) => sum + entry.revenue, 0);
  const averageRevenue = totalRevenue / data.length;

  document.getElementById('totalRevenue').innerText = totalRevenue;
  document.getElementById('averageRevenue').innerText = averageRevenue.toFixed(2);
}

// Function to create and update the sales chart
function createChart(data) {
  const ctx = document.getElementById('salesChart').getContext('2d');
  const chartType = document.getElementById('chartType').value;
  const color = document.getElementById('colorPicker').value;

  const maxRevenue = Math.max(...data.map(entry => entry.revenue));
  const minRevenue = 0;

  new Chart(ctx, {
      type: chartType,
      data: {
          labels: data.map(entry => entry.month),
          datasets: [{
              label: 'Revenue',
              data: data.map(entry => entry.revenue),
              backgroundColor: color + '99', // Adding transparency
              borderColor: color,
              borderWidth: 1
          }]
      },
      options: {
          plugins: {
              tooltip: {
                  callbacks: {
                      label: function(tooltipItem) {
                          return `Revenue: $${tooltipItem.raw}`;
                      }
                  }
              },
              annotation: {
                  annotations: {
                      line1: {
                          type: 'line',
                          yMin: 20000,
                          yMax: 20000,
                          borderColor: 'red',
                          borderWidth: 2,
                          label: {
                              content: 'Target',
                              enabled: true,
                              position: 'end'
                          }
                      }
                  }
              }
          },
          scales: {
              y: {
                  beginAtZero: true,
                  min: minRevenue,
                  max: maxRevenue + (maxRevenue * 0.1) // Add 10% padding
              }
          }
      }
  });

  calculateInsights(data);
}

// Function to create a comparison chart
function createComparisonChart(data) {
  const ctx = document.getElementById('salesChart').getContext('2d');
  const chartType = document.getElementById('chartType').value;
  const color = document.getElementById('colorPicker').value;

  new Chart(ctx, {
      type: chartType,
      data: {
          labels: data.map(entry => entry.month),
          datasets: [{
              label: 'Revenue',
              data: data.map(entry => entry.revenue),
              backgroundColor: color + '99',
              borderColor: color,
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('dark-mode-checkbox');

  // Check if dark mode preference is stored in localStorage
  if (localStorage.getItem('dark-mode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
  }

  darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('dark-mode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('dark-mode', 'disabled');
    }
  });
});

// JavaScript for hiding and showing icons on scroll
document.addEventListener('DOMContentLoaded', () => {
  let lastScrollTop = 0;
  const githubIcon = document.querySelector('.github-corner');
  const darkModeToggle = document.querySelector('.dark-mode-toggle');

  window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > lastScrollTop) {
      // Scrolling down
      githubIcon.style.transform = 'translateY(100%)';
      darkModeToggle.style.transform = 'translateY(100%)';
    } else {
      // Scrolling up
      githubIcon.style.transform = 'translateY(0)';
      darkModeToggle.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
  });

  // Dark Mode Toggle
  const checkbox = document.getElementById('dark-mode-checkbox');
  checkbox.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', checkbox.checked);
  });
});
