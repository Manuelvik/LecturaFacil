package com.lecturafacil.backend.controller;

import com.lecturafacil.backend.model.Documento;
import com.lecturafacil.backend.repository.DocumentoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documentos")
@CrossOrigin(origins = "http://localhost:4200")
public class DocumentoController {

    private final DocumentoRepository repository;

    public DocumentoController(DocumentoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Documento> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Documento guardar(@RequestBody Documento documento) {
        return repository.save(documento);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Documento actualizar(
            @PathVariable Long id,
            @RequestBody Documento documento
    ) {
        Documento existente = repository.findById(id)
                .orElseThrow();

        existente.setTitulo(documento.getTitulo());
        existente.setContenido(documento.getContenido());
        existente.setFecha(documento.getFecha());
        existente.setFavorito(documento.isFavorito());

        return repository.save(existente);
    }
}