import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {
  ingredientes: string = '';
  receta: string = '';
  loading: boolean = false;
  recetaSeparada1: string = '';
  recetaSeparada2: string = '';
  isDarkMode: boolean = false;

  private readonly initialFiltros = {
    tipoDieta: '',
    tiempo:'',
    dificultad:'',
    origen:'',
    tipoPlato:'',
    coccion:'',
    nutricional: false
  };
  filtros = { ...this.initialFiltros };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  buscarReceta(form: NgForm) {
    const nombrePlato = this.ingredientes?.trim();

    if (!nombrePlato) {
      this.recetaSeparada1 = 'Por favor, ingresá ingredientes válidos.';
      this.recetaSeparada2 = '';
      this.receta = '';
      return;
    }

    this.loading = true;
    this.receta = '';
    this.recetaSeparada1 = '';
    this.recetaSeparada2 = '';

    console.log("filtros: ", this.filtros);
    
    this.http.post<any>('https://qo5ujta37f.execute-api.us-east-1.amazonaws.com/nuev/funcionmvp1', { nombrePlato, filtros: this.filtros})
      .subscribe({
        next: (response) => {          
          const textoLimpio = response.receta.replace(/\*/g, '').trim();
          this.receta = textoLimpio;

          const partes = textoLimpio.split(/Receta\s*2\s*[:\-]/i);
          if (partes.length === 2) {
            this.recetaSeparada1 = partes[0].trim();
            this.recetaSeparada2 = 'Receta 2: ' + partes[1].trim();
          } else {
            this.recetaSeparada1 = textoLimpio;
            this.recetaSeparada2 = '';
          }
          this.loading = false;
          this.ingredientes = '';
          this.filtros     = { ...this.initialFiltros };    
        },
        error: (error) => {
          this.recetaSeparada1 = 'Error al generar receta.';
          this.recetaSeparada2 = '';
          this.receta = '';
          this.ingredientes = '';
          this.filtros     = { ...this.initialFiltros };          
          this.loading = false;
        }
      });
  }

  leerEnVozAlta(texto: string): void {
    if (!texto) return;
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-AR' // Español
    speechSynthesis.cancel(); // Detener lectura anterior
    speechSynthesis.speak(mensaje);
  }

  pausarLectura(): void {
    speechSynthesis.pause();
  }

  reanudarLectura(): void {
    speechSynthesis.resume();
  }

  detenerLectura(): void {
    speechSynthesis.cancel();
  }
}
