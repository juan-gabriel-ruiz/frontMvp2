import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isDarkMode = false;
  imagenes: string[] = [
    'assets/1.png',
    'assets/2.png',
    'assets/3.png',
    'assets/4.png',
    'assets/5.png',
    'assets/6.png',
    'assets/7.png',
    'assets/8.png'
  ];
  
  indiceActual = 0;
  intervalo: any;

  ngOnInit() {
    this.intervalo = setInterval(() => {
      this.indiceActual = (this.indiceActual + 1) % this.imagenes.length;
    }, 3000); // Cambia cada 3 segundos
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }
}
