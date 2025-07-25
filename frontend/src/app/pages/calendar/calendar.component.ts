import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  selectedMonth: string = this.getCurrentMonth();
  selectedTracker: 'mood' | 'period' = 'mood';

  daysInMonth: { day: number; fullDate: string }[] = [];

  moodsByDate: { [date: string]: string } = {};
  periodByDate: { [date: string]: boolean } = {};

  selectedDate: string | null = null;

  moodList = [
    { name: 'Happy', color: '#FFD700' },
    { name: 'Bored', color: '#C0C0C0' },
    { name: 'Sad', color: '#87CEFA' },
    { name: 'Angry', color: '#FF6347' },
    { name: 'Sleepy', color: '#9370DB' },
    { name: 'Anxious', color: '#00CED1' },
    { name: 'Cool', color: '#32CD32' },
  ];

  moodColors: { [mood: string]: string } = {
    Happy: '#FFD700',
    Bored: '#C0C0C0',
    Sad: '#87CEFA',
    Angry: '#FF6347',
    Sleepy: '#9370DB',
    Anxious: '#00CED1',
    Cool: '#32CD32',
  };

  constructor(private http: HttpClient) {
    this.generateCalendar();
    this.loadEntries();
  }

  getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
  }

  generateCalendar() {
    this.daysInMonth = [];
    const [year, month] = this.selectedMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
    const padding = (firstDay + 6) % 7;
    const numDays = new Date(year, month, 0).getDate();

    for (let i = 0; i < padding; i++) {
      this.daysInMonth.push({ day: 0, fullDate: '' });
    }

    for (let i = 1; i <= numDays; i++) {
      const fullDate = `${year}-${String(month).padStart(2, '0')}-${String(
        i
      ).padStart(2, '0')}`;
      this.daysInMonth.push({ day: i, fullDate });
    }
  }

  loadEntries() {
    this.http
      .get<any[]>(`${environment.apiUrl}/entry?month=${this.selectedMonth}`)
      .subscribe((entries) => {
        const moods: { [date: string]: string } = {};
        const periods: { [date: string]: boolean } = {};

        for (const entry of entries) {
          moods[entry.date] = entry.mood;
          periods[entry.date] = entry.period || false;
        }

        this.moodsByDate = moods;
        this.periodByDate = periods;
      });
  }

  selectMood(day: { fullDate: string }, mood: string) {
    if (!mood) return;

    this.http
      .post(`${environment.apiUrl}/entry`, {
        date: day.fullDate,
        mood,
        period: this.periodByDate[day.fullDate] || false,
      })
      .subscribe(() => {
        this.moodsByDate = {
          ...this.moodsByDate,
          [day.fullDate]: mood,
        };
        this.selectedDate = null;
      });
  }

  toggleMoodPanel(day: { fullDate: string }) {
    this.selectedDate =
      this.selectedDate === day.fullDate ? null : day.fullDate;
  }

  togglePeriod(date: string, isPeriod: boolean) {
    this.http
      .post(`${environment.apiUrl}/entry`, {
        date,
        mood: this.moodsByDate[date] || '',
        period: isPeriod,
      })
      .subscribe(() => {
        this.periodByDate = {
          ...this.periodByDate,
          [date]: isPeriod,
        };
      });
  }

  moodEntries(): string[] {
    return Object.keys(this.moodColors);
  }
}
