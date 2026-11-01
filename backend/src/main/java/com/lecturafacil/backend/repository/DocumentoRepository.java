package com.lecturafacil.backend.repository;

import com.lecturafacil.backend.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentoRepository extends JpaRepository<Documento, Long> {
}