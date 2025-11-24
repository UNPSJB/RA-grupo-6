import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { DetalleInformeSinteticoCompleto } from "../types";

const styles = StyleSheet.create({
    page: { 
        padding: 40, 
        fontFamily: 'Helvetica', 
        fontSize: 11, 
        color: '#333',
        lineHeight: 1.4
    },
    header: { 
        marginBottom: 25, 
        borderBottom: '2px solid #1a365d', 
        paddingBottom: 15 
    },
    title: { 
        fontSize: 20, 
        fontFamily: 'Helvetica-Bold', 
        textAlign: "center",
        color: '#1a365d',
        marginBottom: 8
    },
    subtitle: { 
        fontSize: 12, 
        color: '#666', 
        textAlign: "center",
        marginBottom: 4
    },
    section: { 
        marginBottom: 20 
    },
    sectionTitle: { 
        fontSize: 14, 
        fontFamily: 'Helvetica-Bold', 
        backgroundColor: '#1a365d',
        color: 'white',
        padding: 8,
        marginBottom: 12,
        borderRadius: 4
    },
    groupTitle: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: '#2d3748',
        marginBottom: 10,
        paddingBottom: 5,
        borderBottom: '1px solid #e2e8f0'
    },
    responseContainer: { 
        marginBottom: 15,
        paddingLeft: 10
    },
    question: { 
        fontFamily: 'Helvetica-Bold', 
        marginBottom: 6, 
        fontSize: 10,
        color: '#2d3748'
    },
    answer: { 
        paddingLeft: 12, 
        borderLeft: '3px solid #cbd5e0', 
        color: '#4a5568',
        fontSize: 10,
        lineHeight: 1.5
    },
    footer: { 
        position: 'absolute', 
        bottom: 30, 
        left: 40, 
        right: 40,
        fontSize: 9, 
        color: '#a0aec0',
        textAlign: 'center',
        borderTop: '1px solid #e2e8f0',
        paddingTop: 10
    },
    pageNumber: {
        position: 'absolute',
        bottom: 30,
        right: 40,
        fontSize: 9,
        color: '#a0aec0'
    }
});

export default function InformeSinteticoPDFDocument({ informe }: { informe: DetalleInformeSinteticoCompleto }) {
    
    const formatText = (text: string) => {
        if (!text) return '';
        return text.length > 500 ? text.substring(0, 500) + '...' : text;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>{informe.titulo_formulario}</Text>
                    <Text style={styles.subtitle}>Departamento: {informe.departamento}</Text>
                    <Text style={styles.subtitle}>
                        Fecha de finalización: {new Date(informe.fecha_completado).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Text>
                </View>

                {/* Contenido*/}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Síntesis del Informe</Text>
                    
                    {informe.respuestas_sintesis_agrupadas.map((grupo, grupoIndex) => (
                        <View 
                            key={grupo.grupo} 
                            style={{ marginBottom: grupoIndex < informe.respuestas_sintesis_agrupadas.length - 1 ? 20 : 0 }} 
                            wrap={false}
                        >
                            {/* Título del Grupo */}
                            <Text style={styles.groupTitle}>
                                {grupo.grupo}. {grupo.titulo_grupo}
                            </Text>
                            
                            {/* Preguntas y respuestas del Grupo */}
                            {grupo.respuestas.map((respuesta, respuestaIndex) => (
                                <View key={respuestaIndex} style={styles.responseContainer} wrap={false}>
                                    <Text style={styles.question}>
                                        {respuesta.pregunta_texto}
                                    </Text>
                                    <Text style={styles.answer}>
                                        {formatText(respuesta.respuesta_texto) || "(Sin respuesta)"}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    Informe Sintético - UNPSJB
                </Text>
                <Text 
                    style={styles.pageNumber} 
                    render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
                    fixed 
                />
            </Page>
        </Document>
    );
}