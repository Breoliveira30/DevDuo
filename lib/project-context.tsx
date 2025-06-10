"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Project } from "@/lib/types"

// Função para gerar ID único sem dependência externa
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

interface ProjectContextType {
  projects: Project[]
  loading: boolean
  addProject: (project: Omit<Project, "id">) => Promise<void>
  updateProject: (project: Project) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  getProject: (id: string) => Project | undefined
  refreshProjects: () => Promise<void>
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar projetos do localStorage e API na inicialização
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      // Primeiro, tenta carregar do localStorage
      const storedProjects = localStorage.getItem("projects")
      if (storedProjects) {
        try {
          const parsedProjects = JSON.parse(storedProjects)
          setProjects(parsedProjects)
        } catch (error) {
          console.error("Erro ao carregar projetos do localStorage:", error)
          await initializeDefaultProjects()
        }
      } else {
        await initializeDefaultProjects()
      }
    } catch (error) {
      console.error("Erro ao carregar projetos:", error)
      await initializeDefaultProjects()
    } finally {
      setLoading(false)
    }
  }

  const initializeDefaultProjects = async () => {
    const initialProjects = [
      {
        id: generateId(),
        title: "Sistema de Agendamento Médico",
        description:
          "Plataforma completa para agendamento de consultas médicas com calendário interativo, notificações automáticas e gestão de pacientes",
        image: "/placeholder.svg?height=400&width=600",
        tech: ["TypeScript", "React", "TailwindCSS", "Node.js"],
        color: "from-emerald-500 to-teal-500",
        demo: "#",
        category: "Sistema Web",
        features: ["TypeScript para tipagem segura", "CSS responsivo", "JavaScript para interatividade", "API RESTful"],
        progress: 100,
      },
      {
        id: generateId(),
        title: "WaterGuardian - Monitor de Consumo de Água IoT",
        description:
          "Sistema completo de monitoramento em tempo real do consumo de água com sensores IoT, dashboard interativo, alertas de vazamento e relatórios de economia desenvolvido com TypeScript, CSS e JavaScript",
        image: "/images/waterguardian-screenshot.png",
        tech: ["TypeScript", "CSS Modules", "JavaScript", "WebSockets", "Chart.js"],
        color: "from-blue-500 to-cyan-500",
        demo: "https://waterguardian.vercel.app/",
        category: "IoT & Monitoramento",
        features: [
          "Dashboard em tempo real",
          "Sensores IoT integrados",
          "Alertas inteligentes",
          "Relatórios de economia",
        ],
        progress: 100,
      },
      {
        id: generateId(),
        title: "Landing Page Loja de Móveis",
        description:
          "Landing page moderna e elegante para loja de móveis com catálogo interativo, visualizador 3D e sistema de orçamentos",
        image: "/images/carvalho-moveis.png",
        tech: ["TypeScript", "TailwindCSS", "Next.js", "Framer Motion"],
        color: "from-amber-500 to-orange-500",
        demo: "https://lading-page-moveis.vercel.app/",
        category: "E-commerce",
        features: [
          "TypeScript para componentes",
          "CSS com animações",
          "JavaScript para interatividade",
          "Renderização otimizada",
        ],
        progress: 100,
      },
    ]
    setProjects(initialProjects)
    localStorage.setItem("projects", JSON.stringify(initialProjects))
  }

  // Salvar projetos no localStorage sempre que houver alterações
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("projects", JSON.stringify(projects))
    }
  }, [projects])

  const addProject = async (projectData: Omit<Project, "id">) => {
    try {
      // Criar projeto localmente
      const newProject = {
        ...projectData,
        id: generateId(),
      }

      setProjects((prev) => [...prev, newProject])

      // Em produção, também salvaria na API
      // await ProjectAPI.createProject(projectData)
    } catch (error) {
      console.error("Erro ao adicionar projeto:", error)
      throw error
    }
  }

  const updateProject = async (project: Project) => {
    try {
      setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)))

      // Em produção, também atualizaria na API
      // await ProjectAPI.updateProject(project.id, project)
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error)
      throw error
    }
  }

  const deleteProject = async (id: string) => {
    try {
      setProjects((prev) => prev.filter((p) => p.id !== id))

      // Em produção, também deletaria da API
      // await ProjectAPI.deleteProject(id)
    } catch (error) {
      console.error("Erro ao deletar projeto:", error)
      throw error
    }
  }

  const getProject = (id: string) => {
    return projects.find((p) => p.id === id)
  }

  const refreshProjects = async () => {
    await loadProjects()
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        addProject,
        updateProject,
        deleteProject,
        getProject,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider")
  }
  return context
}
