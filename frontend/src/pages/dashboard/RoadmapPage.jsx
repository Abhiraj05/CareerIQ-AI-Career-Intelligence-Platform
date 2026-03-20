import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROADMAPS, CAREER_ROLES } from "../../data/mockData";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TagInput from "../../components/ui/TagInput";
import { FormSelect } from "../../components/ui/FormInput";
import Icon from "../../components/ui/Icon";
import Loader from "../../components/ui/Loader";
import axios from "axios";
import { Target, Flag } from "lucide-react";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function RoadmapPage() {
  const [form, setForm] = useState({
    role_name: CAREER_ROLES[0],
    experience_level: "Intermediate",
  });
  const [skills, setSkills] = useState(["JavaScript", "HTML/CSS"]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [open, setOpen] = useState({});
  const [done, setDone] = useState({});
  const [career, setCareer] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  // const roadmap = ROADMAPS[career] || ROADMAPS["Frontend Developer"];

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    form.current_skills = skills;
    try {
      setGenerated(false);
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/roadmap/generate_roadmap/",
        form,
      );
      setCareer(response.data.career_role);
      setRoadmap(response.data.roadmap);
      setGenerated(true);
      setLoading(false);
      alert("roadmap generated successfully");
    } catch (error) {
      console.log(error);
      alert("roadmap generation failed");

    }
  };

  const toggleOpen = (i) => setOpen((o) => ({ ...o, [i]: !o[i] }));
  const toggleDone = (key) => setDone((d) => ({ ...d, [key]: !d[key] }));

  return (
    <div>
      <PageHeader
        title="Generate Career Roadmap"
        subtitle="Configure your profile and receive a personalized AI-built learning roadmap."
      />

      {/* Config Form */}
      <Card padding="p-7" className="mb-7">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <FormSelect
              label="Target Career Role"
              options={CAREER_ROLES}
              value={form.role_name}
              onChange={set("role_name")}
            />
            <FormSelect
              label="Experience Level"
              options={LEVELS}
              value={form.experience_level}
              onChange={set("experience_level")}
            />
          </div>
          <div className="mb-6">
            <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-2">
              Current Skills{" "}
              <span className="text-accent normal-case">
                · press Enter to add
              </span>
            </label>
            <TagInput
              tags={skills}
              setTags={setSkills}
              placeholder="Add a skill..."
            />
          </div>
          <Button type="submit">
            <Icon name="bolt" size={15} />
            {loading ? "Generating..." : "Generate Roadmap"}
          </Button>
        </form>
      </Card>

      {/* Loading */}
      {loading && <Loader text="Building your personalized roadmap..." />}

      {/* Roadmap Output */}
      <AnimatePresence>
        {generated && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Title row */}
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display font-bold text-xl">
                {career} Roadmap
              </h2>
              <span className="bg-accent2/10 border border-accent2/30 text-accent2 text-xs font-semibold rounded-full px-3 py-1">
                AI Generated
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {generated &&
                roadmap?.map((phase, pi) => {
                  const completedCount = phase.modules.filter(
                    (_, mi) => done[`${pi}-${mi}`],
                  ).length;
                  return (
                    <div
                      key={pi}
                      className="border border-white/[0.07] rounded-xl overflow-hidden hover:border-accent/30 transition-colors duration-300"
                    >
                      {/* Phase Header */}
                      <button
                        type="button"
                        onClick={() => toggleOpen(pi)}
                        className="flex items-center gap-4 w-full px-5 py-4 bg-surface hover:bg-surface2 transition-colors text-left"
                      >
                        <span className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center text-xs font-bold text-accent font-display flex-shrink-0">
                          {pi + 1}
                        </span>
                        <span className="font-display font-semibold text-sm flex-1">
                          {phase.phase}
                        </span>
                        <span className="text-xs text-muted mr-2">
                          {completedCount}/{phase.modules.length} done
                        </span>
                        <motion.div
                          animate={{ rotate: open[pi] ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <Icon
                            name="chevron"
                            size={15}
                            className="text-muted"
                          />
                        </motion.div>
                      </button>

                      {/* Phase Body */}
                      <AnimatePresence>
                        {open[pi] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div className="bg-surface2 border-t border-white/[0.07]">
                              {phase.modules.map((mod, mi) => {
                                const key = `${pi}-${mi}`;
                                const isDone = done[key];
                                return (
                                  <motion.div
                                    key={mi}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: mi * 0.05 }}
                                    onClick={() => toggleDone(key)}
                                    className="flex items-center gap-4 px-5 py-3.5 border-b border-white/[0.04] last:border-0 cursor-pointer hover:bg-white/[0.02] transition-colors group"
                                  >
                                    <div
                                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${isDone ? "bg-accent2/15 border-accent2" : "border-white/20 group-hover:border-accent/60"}`}
                                    >
                                      {isDone && (
                                        <Icon
                                          name="check"
                                          size={11}
                                          className="text-accent2"
                                        />
                                      )}
                                    </div>
                                    <span
                                      className={`text-sm transition-all duration-200 ${isDone ? "line-through text-muted" : "text-[#e8e8f0]"}`}
                                    >
                                      {mod}
                                    </span>
                                    {isDone && (
                                      <span className="ml-auto text-xs text-accent2 font-medium">
                                        Completed
                                      </span>
                                    )}
                                  </motion.div>
                                );
                              })}
                            </div>
                            <div className="bg-surface2 pt-4 border-t border-white/[0.04]  pl-6 space-y-4">
                              {/* Focus Section */}
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Target size={14} className="text-white/40" />
                                  <p className="text-[11px] uppercase tracking-wider text-white/30">
                                    Focus
                                  </p>
                                </div>
                                <p className="text-sm text-white/85 leading-relaxed pl-5">
                                  {phase.focus}
                                </p>
                              </div>

                              {/* Milestone Section */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Flag size={14} className="text-white/40" />
                                  <p className="text-[11px] uppercase tracking-wider text-white/30">
                                    Milestone
                                  </p>
                                </div>
                                <div className="pl-5 pb-5">
                                  <span className="inline-block text-xs text-cyan-300 bg-cyan-400/10 px-3 py-1.5 rounded-md border border-cyan-400/20 shadow-[0_0_6px_rgba(34,211,238,0.12)]">
                                    {phase.milestone}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
