package com.library.loanservice.service;

import com.library.loanservice.dto.LoanDTO;
import com.library.loanservice.entity.Loan;
import com.library.loanservice.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private RestTemplate restTemplate;

    private static final String USER_SERVICE_URL = "http://user-service:8081/api/users";
    private static final String BOOK_SERVICE_URL = "http://book-service:8082/api/books";

    public List<LoanDTO> getAllLoans() {
        return loanRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public LoanDTO getLoanById(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + id));
        return convertToDTO(loan);
    }

    public LoanDTO createLoan(LoanDTO loanDTO) {
        // Verificar que el usuario existe
        try {
            restTemplate.getForObject(USER_SERVICE_URL + "/" + loanDTO.getUserId(), Object.class);
        } catch (Exception e) {
            throw new RuntimeException("User not found");
        }

        // Verificar que el libro existe
        try {
            restTemplate.getForObject(BOOK_SERVICE_URL + "/" + loanDTO.getBookId(), Object.class);
        } catch (Exception e) {
            throw new RuntimeException("Book not found");
        }

        // Actualizar copias disponibles del libro
        try {
            restTemplate.put(BOOK_SERVICE_URL + "/" + loanDTO.getBookId() + "/copies?change=-1", null);
        } catch (Exception e) {
            throw new RuntimeException("Error updating book copies");
        }

        Loan loan = convertToEntity(loanDTO);
        Loan savedLoan = loanRepository.save(loan);
        return convertToDTO(savedLoan);
    }

    public LoanDTO returnLoan(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        loan.setReturnDate(LocalDate.now());
        loan.setStatus(Loan.LoanStatus.RETURNED);

        // Actualizar copias disponibles del libro
        try {
            restTemplate.put(BOOK_SERVICE_URL + "/" + loan.getBookId() + "/copies?change=1", null);
        } catch (Exception e) {
            throw new RuntimeException("Error updating book copies");
        }

        Loan updatedLoan = loanRepository.save(loan);
        return convertToDTO(updatedLoan);
    }

    public LoanDTO updateLoan(Long id, LoanDTO loanDTO) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        loan.setDueDate(loanDTO.getDueDate());
        loan.setNotes(loanDTO.getNotes());

        Loan updatedLoan = loanRepository.save(loan);
        return convertToDTO(updatedLoan);
    }
    public List<LoanDTO> getActiveLoans() {
        return loanRepository.findByStatus(Loan.LoanStatus.ACTIVE)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteLoan(Long id) {
        loanRepository.deleteById(id);
    }

    public List<LoanDTO> getLoansByUser(Long userId) {
        return loanRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private LoanDTO convertToDTO(Loan loan) {
        LoanDTO dto = new LoanDTO();
        dto.setId(loan.getId());
        dto.setUserId(loan.getUserId());
        dto.setBookId(loan.getBookId());
        dto.setLoanDate(loan.getLoanDate());
        dto.setDueDate(loan.getDueDate());
        dto.setReturnDate(loan.getReturnDate());
        dto.setStatus(loan.getStatus().toString());
        dto.setNotes(loan.getNotes());
        return dto;
    }

    private Loan convertToEntity(LoanDTO dto) {
        Loan loan = new Loan();
        loan.setUserId(dto.getUserId());
        loan.setBookId(dto.getBookId());
        loan.setLoanDate(dto.getLoanDate());
        loan.setDueDate(dto.getDueDate());
        loan.setNotes(dto.getNotes());
        return loan;
    }
}