function gradeApp() {
    return {
        // Data
        batches: [],
        years: [],
        semesters: [],
        courses: [],

        // Selected values
        selectedBatch: '',
        selectedYear: '',
        selectedSemester: '',

        // State
        loading: false,
        error: '',
        analyzed: false,

        // Init
        async init() {
            await this.fetchBatches();
        },

        // Fetch all batches
        async fetchBatches() {
            try {
                const res = await fetch('http://localhost:3000/api/batches');
                this.batches = await res.json();
            } catch (err) {
                this.error = 'Failed to load batches';
            }
        },

        // When batch is selected
        async selectBatch(batch) {
            this.selectedBatch = batch;
            this.selectedYear = '';
            this.selectedSemester = '';
            this.years = [];
            this.semesters = [];
            this.courses = [];
            this.analyzed = false;
            if (batch) {
                await this.fetchYears();
            }
        },

        // Fetch years for selected batch
        async fetchYears() {
            try {
                const res = await fetch(`http://localhost:3000/api/years/${encodeURIComponent(this.selectedBatch)}`);
                this.years = await res.json();
            } catch (err) {
                this.error = 'Failed to load years';
            }
        },

        // When year is selected
        async onYearChange() {
            this.selectedSemester = '';
            this.semesters = [];
            this.courses = [];
            this.analyzed = false;
            if (this.selectedYear) {
                await this.fetchSemesters();
            }
        },

        // Fetch semesters for selected batch + year
        async fetchSemesters() {
            try {
                const res = await fetch(`http://localhost:3000/api/semesters/${encodeURIComponent(this.selectedBatch)}/${this.selectedYear}`);
                this.semesters = await res.json();
            } catch (err) {
                this.error = 'Failed to load semesters';
            }
        },

        // Fetch grade analysis
        async analyze() {
            if (!this.selectedBatch || !this.selectedYear || !this.selectedSemester) {
                this.error = 'Please select batch, year and semester';
                return;
            }
            this.loading = true;
            this.error = '';
            this.analyzed = false;
            try {
                const res = await fetch(`http://localhost:3000/api/grades/${encodeURIComponent(this.selectedBatch)}/${this.selectedYear}/${this.selectedSemester}`);
                const data = await res.json();
                this.courses = data.courses;
                this.analyzed = true;
            } catch (err) {
                this.error = 'Failed to load grade analysis';
            } finally {
                this.loading = false;
            }
        }
    }
}